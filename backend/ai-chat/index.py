import os
import json
from openai import OpenAI

def handler(event: dict, context) -> dict:
    """AI-чат наставник для платформы Bubblegum. Отвечает на вопросы об играх и программировании."""

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    messages = body.get('messages', [])
    topic = body.get('topic', 'платформер')

    if not messages:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Нет сообщений'})}

    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

    system_prompt = f"""Ты дружелюбный AI-наставник на платформе Bubblegum — обучающем сайте для программирования.
Сейчас помогаешь пользователю доработать игру: {topic}.
Отвечай кратко, по-русски, простым языком без лишнего жаргона.
Если объясняешь код — используй короткие примеры на JavaScript.
Иногда добавляй эмодзи 🍬🍒 чтобы было весело.
Не отвечай на темы не связанные с программированием и играми."""

    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[{'role': 'system', 'content': system_prompt}] + messages,
        max_tokens=500,
        temperature=0.7,
    )

    answer = response.choices[0].message.content

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'answer': answer}, ensure_ascii=False),
    }
