import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const HERO_IMG = 'https://cdn.poehali.dev/projects/b35f0b67-a6a3-4e0e-8e53-842140d343cd/files/372d304c-d9b5-4d02-95fd-09869bf77968.jpg';

const courses = [
  { emoji: '🍬', icon: 'Code2', title: 'Python с нуля', desc: 'Базовый синтаксис, логика и первые программы с ИИ-наставником.', level: 'Новичок' },
  { emoji: '🍒', icon: 'Braces', title: 'JavaScript и Web', desc: 'Создавай интерактивные сайты и приложения шаг за шагом.', level: 'Новичок' },
  { emoji: '🍬', icon: 'Boxes', title: 'Алгоритмы', desc: 'Разбор задач с подсказками искусственного интеллекта.', level: 'Средний' },
];

const templates = [
  { emoji: '🍒', icon: 'Gamepad2', title: 'Платформер', desc: 'Готовый шаблон 2D-игры с героем и уровнями.', tag: 'Игра' },
  { emoji: '🍬', icon: 'Dice5', title: 'Викторина', desc: 'Игра-квиз с вопросами и подсчётом очков.', tag: 'Игра' },
  { emoji: '🍒', icon: 'ListTodo', title: 'To-Do приложение', desc: 'Список задач — классика для старта.', tag: 'Приложение' },
  { emoji: '🍬', icon: 'Cloud', title: 'Погода', desc: 'Простое приложение с API и интерфейсом.', tag: 'Приложение' },
];

// Плавающие декоративные символы
const floaters = [
  { symbol: '🍬', style: 'top-[10%] left-[5%] text-3xl opacity-40 animate-float', delay: '0s' },
  { symbol: '🍒', style: 'top-[20%] right-[8%] text-2xl opacity-50 animate-float', delay: '1s' },
  { symbol: '🫧', style: 'top-[55%] left-[3%] text-4xl opacity-30 animate-float', delay: '2s' },
  { symbol: '🍬', style: 'bottom-[15%] right-[5%] text-3xl opacity-40 animate-float', delay: '0.5s' },
  { symbol: '🍒', style: 'bottom-[30%] left-[8%] text-2xl opacity-35 animate-float', delay: '1.5s' },
  { symbol: '🫧', style: 'top-[40%] right-[3%] text-2xl opacity-25 animate-float', delay: '2.5s' },
];

const Index = () => {
  const [chat, setChat] = useState('');

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <nav className="container flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 font-display font-bold text-xl">
            <span className="text-2xl">🍬</span>
            Bubblegum
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#courses" className="hover:text-primary transition-colors">🍒 Обучение</a>
            <a href="#templates" className="hover:text-primary transition-colors">🍬 Шаблоны</a>
            <a href="#ai" className="hover:text-primary transition-colors">🫧 AI-консультант</a>
            <a href="#access" className="hover:text-primary transition-colors">🍒 Доступ</a>
          </div>
          <Button className="rounded-full">Войти</Button>
        </nav>
      </header>

      {/* HERO */}
      <section className="gradient-pink relative overflow-hidden">
        {floaters.map((f, i) => (
          <span
            key={i}
            className={`absolute pointer-events-none select-none ${f.style}`}
            style={{ animationDelay: f.delay }}
          >{f.symbol}</span>
        ))}
        <div className="container grid md:grid-cols-2 gap-10 items-center py-16 md:py-24 relative z-10">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 text-primary text-sm font-semibold mb-6">
              🍬 Обучение с искусственным интеллектом
            </span>
            <h1 className="font-display font-black text-4xl md:text-6xl leading-[1.05] mb-6">
              Учись <span className="text-gradient">программировать</span> вместе с ИИ 🍒
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Курсы по языкам программирования, готовые шаблоны игр и приложений и личный AI-наставник, который всегда подскажет.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full text-base h-12 px-7">
                Начать бесплатно 🍬
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base h-12 px-7 bg-white/60">
                Шаблоны игр 🍒
              </Button>
            </div>
          </div>
          <div className="relative">
            <img src={HERO_IMG} alt="ИИ-наставник" className="w-full rounded-3xl shadow-2xl animate-float" />
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="container py-20 relative">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">🍒 Обучение языкам</h2>
          <p className="text-muted-foreground">Пошаговые курсы с поддержкой искусственного интеллекта</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c.title} className="group bg-card rounded-3xl p-7 border border-border hover-scale shadow-sm">
              <div className="text-4xl mb-5">{c.emoji}</div>
              <span className="text-xs font-semibold text-primary bg-secondary px-3 py-1 rounded-full">{c.level}</span>
              <h3 className="font-display font-bold text-xl mt-4 mb-2">{c.title}</h3>
              <p className="text-muted-foreground text-sm">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" className="gradient-pink py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">🍬 Шаблоны игр и приложений</h2>
            <p className="text-muted-foreground">Начни проект за минуту — выбери готовый шаблон</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((t) => (
              <div key={t.title} className="bg-white rounded-3xl p-6 hover-scale shadow-sm">
                <div className="text-4xl mb-4">{t.emoji}</div>
                <span className="text-xs font-semibold text-muted-foreground">{t.tag}</span>
                <h3 className="font-display font-bold text-lg mt-1 mb-2">{t.title}</h3>
                <p className="text-muted-foreground text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI CONSULTANT */}
      <section id="ai" className="container py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-primary text-sm font-semibold mb-5">
              🫧 AI-консультант
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Спроси что угодно о коде 🍒</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Личный ИИ-помощник объяснит сложное простыми словами, найдёт ошибку и подскажет, как улучшить твой проект.
            </p>
            <ul className="space-y-3">
              {[
                { text: 'Объяснение тем простым языком', emoji: '🍬' },
                { text: 'Помощь с ошибками в коде', emoji: '🍒' },
                { text: 'Идеи для твоих проектов', emoji: '🫧' },
              ].map((f) => (
                <li key={f.text} className="flex items-center gap-3">
                  <span className="text-xl">{f.emoji}</span>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-3xl border border-border shadow-lg p-6">
            <div className="space-y-4 mb-5">
              <div className="flex gap-3">
                <span className="text-2xl shrink-0">🍬</span>
                <div className="bg-secondary rounded-2xl rounded-tl-none px-4 py-3 text-sm">
                  Привет! Я твой AI-наставник 🍒 О чём хочешь узнать сегодня?
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-4 py-3 text-sm">
                  Как работает цикл for?
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                value={chat}
                onChange={(e) => setChat(e.target.value)}
                placeholder="Напиши свой вопрос... 🍬"
                className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <Button size="icon" className="rounded-full shrink-0 w-11 h-11">
                <Icon name="Send" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PAID ACCESS */}
      <section id="access" className="container pb-24">
        <div className="gradient-pink rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            {['🍬','🍒','🫧','🍬','🍒','🍬','🍒','🫧'].map((s, i) => (
              <span key={i} className="absolute text-2xl opacity-20 animate-float" style={{
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.4}s`
              }}>{s}</span>
            ))}
          </div>
          <div className="relative z-10">
            <div className="text-5xl mb-5">🍒</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Платный доступ к платформе</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Полный доступ ко всем курсам, шаблонам и AI-консультанту открывается после оплаты. Оформить можно через мою личную соцсеть.
            </p>
            <Button size="lg" className="rounded-full text-base h-13 px-8 py-6">
              🍬 Получить доступ через соцсеть
            </Button>
            <p className="text-xs text-muted-foreground mt-4">После оплаты доступ подтверждается автоматически</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display font-bold text-foreground">
            🍬 Bubblegum 🍒
          </div>
          <p>© 2026 Bubblegum — обучение программированию с ИИ</p>
          <div className="flex gap-2 text-lg">🍬 🍒 🫧</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
