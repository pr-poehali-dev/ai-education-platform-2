import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { SITE } from '@/site.config';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';

// ============================================================
// Платформер — простая рабочая игра на Canvas
// ============================================================

const GAME_W = 600;
const GAME_H = 320;

type Rect = { x: number; y: number; w: number; h: number };
type Player = Rect & { vy: number; onGround: boolean };

const PLATFORMS: Rect[] = [
  { x: 0,   y: 290, w: 200, h: 30 },
  { x: 220, y: 290, w: 140, h: 30 },
  { x: 380, y: 290, w: 220, h: 30 },
  { x: 80,  y: 210, w: 120, h: 16 },
  { x: 280, y: 200, w: 100, h: 16 },
  { x: 450, y: 175, w: 110, h: 16 },
  { x: 160, y: 130, w: 90,  h: 16 },
  { x: 350, y: 110, w: 80,  h: 16 },
];

const COINS: { x: number; y: number; collected: boolean }[] = [
  { x: 120, y: 185, collected: false },
  { x: 320, y: 175, collected: false },
  { x: 490, y: 150, collected: false },
  { x: 195, y: 105, collected: false },
  { x: 385, y:  85, collected: false },
];

function initGame(): { player: Player; coins: typeof COINS; score: number } {
  return {
    player: { x: 30, y: 240, w: 28, h: 36, vy: 0, onGround: false },
    coins: COINS.map(c => ({ ...c, collected: false })),
    score: 0,
  };
}

function collides(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function PlatformerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(initGame());
  const keysRef = useRef<Record<string, boolean>>({});
  const rafRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [win, setWin] = useState(false);

  function restart() {
    stateRef.current = initGame();
    setScore(0);
    setWin(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => { keysRef.current[e.key] = down; };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function loop() {
      const s = stateRef.current;
      const p = s.player;
      const keys = keysRef.current;

      // движение
      const speed = 3.5;
      if (keys['ArrowLeft'] || keys['a']) p.x -= speed;
      if (keys['ArrowRight'] || keys['d']) p.x += speed;
      if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && p.onGround) {
        p.vy = -9.5;
        p.onGround = false;
      }

      // гравитация
      p.vy += 0.45;
      p.y += p.vy;
      p.onGround = false;

      // коллизии с платформами
      for (const pl of PLATFORMS) {
        if (collides(p, pl)) {
          if (p.vy > 0 && p.y + p.h - p.vy <= pl.y + 2) {
            p.y = pl.y - p.h;
            p.vy = 0;
            p.onGround = true;
          } else if (p.vy < 0) {
            p.y = pl.y + pl.h;
            p.vy = 0;
          } else {
            p.x -= (keys['ArrowRight'] || keys['d']) ? speed : -speed;
          }
        }
      }

      // границы
      if (p.x < 0) p.x = 0;
      if (p.x + p.w > GAME_W) p.x = GAME_W - p.w;
      if (p.y > GAME_H) { p.y = 0; p.vy = 0; }

      // монеты
      for (const coin of s.coins) {
        if (!coin.collected && collides(p, { x: coin.x - 10, y: coin.y - 10, w: 20, h: 20 })) {
          coin.collected = true;
          s.score++;
          setScore(s.score);
          if (s.score >= COINS.length) setWin(true);
        }
      }

      // ---- РИСУЕМ ----
      // фон
      const bg = ctx.createLinearGradient(0, 0, 0, GAME_H);
      bg.addColorStop(0, '#fce7f3');
      bg.addColorStop(1, '#fbcfe8');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      // облачка-декор
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      [[60,40,70,28],[200,25,90,22],[420,50,60,20],[510,20,80,25]].forEach(([x,y,w,h]) => {
        ctx.beginPath(); ctx.ellipse(x,y,w/2,h/2,0,0,Math.PI*2); ctx.fill();
      });

      // платформы
      for (const pl of PLATFORMS) {
        ctx.fillStyle = '#f9a8d4';
        ctx.beginPath();
        ctx.roundRect(pl.x, pl.y, pl.w, pl.h, 8);
        ctx.fill();
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(pl.x, pl.y, pl.w, 4);
      }

      // монеты
      for (const coin of s.coins) {
        if (coin.collected) continue;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🍒', coin.x, coin.y);
      }

      // игрок (милый персонаж)
      // тело
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.roundRect(p.x, p.y + 14, p.w, p.h - 14, 8);
      ctx.fill();
      // голова
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2, p.y + 10, 14, 0, Math.PI * 2);
      ctx.fill();
      // глазки
      ctx.fillStyle = '#1f2937';
      ctx.beginPath(); ctx.arc(p.x + p.w/2 - 4, p.y + 8, 2.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(p.x + p.w/2 + 4, p.y + 8, 2.5, 0, Math.PI*2); ctx.fill();
      // улыбка
      ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(p.x + p.w/2, p.y + 12, 4, 0.2, Math.PI - 0.2); ctx.stroke();

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-between w-full max-w-[600px]">
        <span className="text-sm font-semibold text-muted-foreground">🍒 Собери все вишенки!</span>
        <span className="font-display font-bold text-primary">Счёт: {score} / {COINS.length}</span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME_W}
          height={GAME_H}
          className="rounded-2xl border-2 border-border shadow-lg w-full max-w-[600px]"
          style={{ imageRendering: 'pixelated' }}
        />
        {win && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-pink-50/90 rounded-2xl">
            <div className="text-5xl mb-3">🎉</div>
            <p className="font-display font-bold text-2xl text-primary mb-4">Ты собрала все вишенки!</p>
            <Button onClick={restart} className="rounded-full">Играть снова 🍒</Button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Управление: ← → или A D — движение, ↑ / W / Пробел — прыжок</p>
    </div>
  );
}

// ============================================================
// Чат с ИИ (заблокирован без подписки)
// ============================================================

const CHAT_TIPS = [
  'Как добавить врага в платформер?',
  'Сделай персонажа быстрее',
  'Добавь двойной прыжок',
  'Как сделать звук при прыжке?',
];

function AiChat({ locked, onLoginClick }: { locked: boolean; onLoginClick?: () => void }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Привет! 🍬 Я помогу тебе доработать платформер. Спроси что угодно о коде игры!' }
  ]);
  const [input, setInput] = useState('');

  function send(text?: string) {
    const msg = text || input;
    if (!msg.trim() || locked) return;
    setMessages(m => [...m, { from: 'user', text: msg }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { from: 'bot', text: '🍒 Отличный вопрос! Я пока в разработке — скоро отвечу по-настоящему. Подключи AI-ключ в настройках.' }]);
    }, 800);
  }

  return (
    <div className="relative bg-card rounded-3xl border border-border shadow-lg flex flex-col h-[420px]">
      {/* заголовок */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <span className="text-2xl">🍬</span>
        <div>
          <p className="font-display font-bold text-sm">AI-наставник</p>
          <p className="text-xs text-muted-foreground">Помогает дорабатывать игру</p>
        </div>
        {locked && (
          <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-primary bg-secondary px-3 py-1 rounded-full">
            <Icon name="Lock" size={12} /> Только по подписке
          </span>
        )}
      </div>

      {/* сообщения */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : ''}`}>
            {m.from === 'bot' && <span className="text-xl shrink-0">🍬</span>}
            <div className={`rounded-2xl px-4 py-2.5 text-sm max-w-[80%] ${
              m.from === 'bot'
                ? 'bg-secondary rounded-tl-none'
                : 'bg-primary text-primary-foreground rounded-tr-none'
            }`}>{m.text}</div>
          </div>
        ))}
      </div>

      {/* быстрые подсказки */}
      {!locked && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {CHAT_TIPS.map(tip => (
            <button key={tip} onClick={() => send(tip)}
              className="text-xs bg-secondary text-secondary-foreground rounded-full px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors">
              {tip}
            </button>
          ))}
        </div>
      )}

      {/* инпут */}
      <div className="p-4 pt-0 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          disabled={locked}
          placeholder={locked ? 'Нужна подписка для общения с ИИ...' : 'Спроси как улучшить игру... 🍒'}
          className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Button size="icon" className="rounded-full shrink-0 w-11 h-11" disabled={locked} onClick={() => send()}>
          <Icon name="Send" size={18} />
        </Button>
      </div>

      {/* оверлей блокировки */}
      {locked && (
        <div className="absolute inset-0 rounded-3xl bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="text-4xl">🍒</div>
          <p className="font-display font-bold text-xl">Чат с ИИ — по подписке</p>
          <p className="text-muted-foreground text-sm max-w-xs">
            Игру можно потрогать бесплатно. Чтобы общаться с AI-наставником — войди или оформи подписку.
          </p>
          <div className="flex flex-col gap-2 w-full max-w-[200px]">
            <Button className="rounded-full w-full" onClick={onLoginClick}>
              🍬 Войти с кодом
            </Button>
            <a href={SITE.links.socialPayment} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full w-full text-xs">Получить доступ 🍒</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Главная страница шаблонов
// ============================================================

export default function Templates() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const { session, isOwner, hasAccess, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />}

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <nav className="container flex items-center justify-between h-16">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 font-display font-bold text-xl hover:text-primary transition-colors">
            <span className="text-2xl">🍬</span>
            {SITE.name}
          </button>
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-2">
                {isOwner && (
                  <span className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full">👑 Владелец</span>
                )}
                <span className="text-sm text-muted-foreground hidden md:block">{session.label}</span>
                <Button variant="outline" size="sm" className="rounded-full" onClick={logout}>Выйти</Button>
              </div>
            ) : (
              <Button size="sm" className="rounded-full text-xs" onClick={() => setShowLogin(true)}>
                🍒 Войти
              </Button>
            )}
            <button onClick={() => navigate('/')} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Icon name="ArrowLeft" size={15} /> На главную
            </button>
          </div>
        </nav>
      </header>

      <div className="container py-10 space-y-10">

        {/* заголовок */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-primary text-sm font-semibold mb-4">
            🍒 Шаблоны игр
          </span>
          <h1 className="font-display font-bold text-3xl md:text-5xl mb-3">
            Платформер 🍬
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Готовая работающая игра — управляй персонажем и собирай вишенки. Спроси AI-наставника, как доработать её под себя.
          </p>
        </div>

        {/* игра + чат */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-display font-bold">🎮 Играй прямо здесь</span>
              <span className="text-xs bg-secondary text-primary px-3 py-1 rounded-full font-semibold">Бесплатно</span>
            </div>
            <PlatformerGame />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-display font-bold">🫧 AI-наставник</span>
              {!hasAccess && (
                <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">Подписка</span>
              )}
            </div>
            <AiChat locked={!hasAccess} onLoginClick={() => setShowLogin(true)} />
          </div>
        </div>

        {/* что можно доработать */}
        <div className="gradient-pink rounded-3xl p-8">
          <h2 className="font-display font-bold text-xl mb-5 text-center">🍬 Что можно доработать с AI-наставником</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '👾', title: 'Добавить врагов', desc: 'AI напишет код для NPC с простым ИИ' },
              { emoji: '🎵', title: 'Звуки и музыка', desc: 'Подключить звук прыжка и победы' },
              { emoji: '🗺️', title: 'Новые уровни', desc: 'Создать несколько уровней сложности' },
              { emoji: '🎨', title: 'Свой дизайн', desc: 'Поменять цвета и нарисовать персонажа' },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">{f.emoji}</div>
                <p className="font-display font-bold text-sm mb-1">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}