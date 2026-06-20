import { useState, useEffect } from 'react';

const AUTH_URL = 'https://functions.poehali.dev/032fb2a4-e3bf-4163-a5ee-05d1abed0309';
const SESSION_KEY = 'bubblegum_session';

export type Role = 'owner' | 'user' | null;

export interface Session {
  role: Role;
  label: string;
  token: string;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try { setSession(JSON.parse(saved)); } catch (e) { console.warn(e); }
    }
  }, []);

  async function login(code: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(AUTH_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ошибка входа');
        return false;
      }
      const sess: Session = { role: data.role, label: data.label, token: data.token };
      setSession(sess);
      localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      return true;
    } catch {
      setError('Ошибка соединения');
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
  }

  const isOwner = session?.role === 'owner';
  const isLoggedIn = !!session;
  const hasAccess = isOwner || session?.role === 'user';

  return { session, loading, error, login, logout, isOwner, isLoggedIn, hasAccess };
}