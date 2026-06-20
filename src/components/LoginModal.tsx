import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ onClose, onSuccess }: Props) {
  const { login, loading, error } = useAuth();
  const [code, setCode] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(code.trim());
    if (ok) onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* оверлей */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />

      {/* карточка */}
      <div className="relative bg-card rounded-3xl border border-border shadow-2xl w-full max-w-sm p-8 animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="X" size={20} />
        </button>

        <div className="text-center mb-7">
          <div className="text-4xl mb-3">🍬</div>
          <h2 className="font-display font-bold text-2xl mb-1">Вход на платформу</h2>
          <p className="text-sm text-muted-foreground">Введи код доступа или пароль владельца</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Введи код..."
              autoFocus
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring pr-10"
            />
            <Icon name="KeyRound" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
              <Icon name="AlertCircle" size={15} />
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading || !code.trim()} className="w-full rounded-2xl h-11">
            {loading
              ? <><Icon name="Loader2" size={16} className="animate-spin mr-2" /> Проверяю...</>
              : <>Войти 🍒</>
            }
          </Button>
        </form>

        <div className="mt-5 pt-5 border-t border-border text-center space-y-1">
          <p className="text-xs text-muted-foreground">Нет кода доступа?</p>
          <a
            href="https://vk.com/artista22"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Получить доступ через соцсеть 🍬
          </a>
        </div>
      </div>
    </div>
  );
}
