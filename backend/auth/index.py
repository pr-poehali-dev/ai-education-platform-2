import os
import json
import pg8000.native

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def get_conn():
    url = os.environ['DATABASE_URL']
    # postgresql://user:password@host:port/dbname
    url = url.replace('postgresql://', '').replace('postgres://', '')
    user_pass, rest = url.split('@', 1)
    user, password = user_pass.split(':', 1)
    host_port, dbname = rest.split('/', 1)
    if ':' in host_port:
        host, port = host_port.split(':', 1)
        port = int(port)
    else:
        host, port = host_port, 5432
    return pg8000.native.Connection(user=user, password=password, host=host, port=port, database=dbname)


def handler(event: dict, context) -> dict:
    """Авторизация на платформе Bubblegum.
    POST /login — вход по паролю владельца или коду доступа.
    POST /add-code — добавить новый код доступа (только для владельца).
    POST /list-codes — список всех кодов (только для владельца).
    POST /delete-code — удалить код (только для владельца).
    """
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': ''}

    path = event.get('path', '/')
    body = json.loads(event.get('body') or '{}')

    if path.endswith('/login'):
        return login(body)
    if path.endswith('/add-code'):
        return add_code(body)
    if path.endswith('/list-codes'):
        return list_codes(body)
    if path.endswith('/delete-code'):
        return delete_code(body)

    return {'statusCode': 404, 'headers': HEADERS, 'body': json.dumps({'error': 'Not found'})}


def login(body: dict) -> dict:
    code = (body.get('code') or '').strip()
    if not code:
        return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Введи код или пароль'}, ensure_ascii=False)}

    # Проверяем пароль владельца
    owner_password = os.environ.get('OWNER_PASSWORD', '')
    if owner_password and code == owner_password:
        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({
            'role': 'owner',
            'label': 'Владелец',
            'token': 'owner:' + owner_password[:8]
        }, ensure_ascii=False)}

    # Проверяем код доступа в БД
    conn = get_conn()
    rows = conn.run(
        "SELECT id, label FROM access_codes WHERE code = :code AND is_active = TRUE",
        code=code
    )

    if not rows:
        conn.close()
        return {'statusCode': 401, 'headers': HEADERS, 'body': json.dumps({'error': 'Неверный код доступа'}, ensure_ascii=False)}

    code_id, label = rows[0]
    conn.run("UPDATE access_codes SET used_at = NOW() WHERE id = :id", id=code_id)
    conn.close()

    return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({
        'role': 'user',
        'label': label or 'Пользователь',
        'token': 'user:' + code[:8]
    }, ensure_ascii=False)}


def _check_owner(body: dict) -> bool:
    owner_password = os.environ.get('OWNER_PASSWORD', '')
    return bool(owner_password and body.get('owner_password') == owner_password)


def add_code(body: dict) -> dict:
    if not _check_owner(body):
        return {'statusCode': 403, 'headers': HEADERS, 'body': json.dumps({'error': 'Нет доступа'}, ensure_ascii=False)}

    code = (body.get('code') or '').strip()
    label = (body.get('label') or '').strip()
    if not code:
        return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Код не может быть пустым'}, ensure_ascii=False)}

    conn = get_conn()
    rows = conn.run(
        "INSERT INTO access_codes (code, label) VALUES (:code, :label) ON CONFLICT (code) DO NOTHING RETURNING id",
        code=code, label=label
    )
    conn.close()

    if not rows:
        return {'statusCode': 409, 'headers': HEADERS, 'body': json.dumps({'error': 'Такой код уже существует'}, ensure_ascii=False)}

    return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'success': True, 'id': rows[0][0]}, ensure_ascii=False)}


def list_codes(body: dict) -> dict:
    if not _check_owner(body):
        return {'statusCode': 403, 'headers': HEADERS, 'body': json.dumps({'error': 'Нет доступа'}, ensure_ascii=False)}

    conn = get_conn()
    rows = conn.run("SELECT id, code, label, is_active, created_at, used_at FROM access_codes ORDER BY created_at DESC")
    conn.close()

    codes = [
        {'id': r[0], 'code': r[1], 'label': r[2], 'is_active': r[3],
         'created_at': str(r[4]), 'used_at': str(r[5]) if r[5] else None}
        for r in rows
    ]
    return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'codes': codes}, ensure_ascii=False)}


def delete_code(body: dict) -> dict:
    if not _check_owner(body):
        return {'statusCode': 403, 'headers': HEADERS, 'body': json.dumps({'error': 'Нет доступа'}, ensure_ascii=False)}

    code_id = body.get('id')
    if not code_id:
        return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Укажи id кода'}, ensure_ascii=False)}

    conn = get_conn()
    conn.run("UPDATE access_codes SET is_active = FALSE WHERE id = :id", id=code_id)
    conn.close()

    return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'success': True}, ensure_ascii=False)}
