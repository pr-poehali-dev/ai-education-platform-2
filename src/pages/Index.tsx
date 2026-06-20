import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SITE } from '@/site.config';

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
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <nav className="container flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 font-display font-bold text-xl">
            <span className="text-2xl">🍬</span>
            {SITE.name}
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {SITE.nav.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </a>
            ))}
          </div>
          <Button className="rounded-full">Войти</Button>
        </nav>
      </header>

      {/* HERO */}
      <section className="gradient-pink relative overflow-hidden">
        {floaters.map((f, i) => (
          <span key={i} className={`absolute pointer-events-none select-none ${f.style}`} style={{ animationDelay: f.delay }}>
            {f.symbol}
          </span>
        ))}
        <div className="container grid md:grid-cols-2 gap-10 items-center py-16 md:py-24 relative z-10">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 text-primary text-sm font-semibold mb-6">
              {SITE.hero.badge}
            </span>
            <h1 className="font-display font-black text-4xl md:text-6xl leading-[1.05] mb-6">
              {SITE.hero.title} <span className="text-gradient">{SITE.hero.titleHighlight}</span> {SITE.hero.titleEnd}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              {SITE.hero.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={SITE.links.startFree}>
                <Button size="lg" className="rounded-full text-base h-12 px-7">
                  {SITE.hero.buttonPrimary}
                </Button>
              </a>
              <Button size="lg" variant="outline" onClick={() => navigate(SITE.links.templatesButton)} className="rounded-full text-base h-12 px-7 bg-white/60">
                {SITE.hero.buttonSecondary}
              </Button>
            </div>
          </div>
          <div className="relative">
            <img src={SITE.hero.image} alt="ИИ-наставник" className="w-full rounded-3xl shadow-2xl animate-float" />
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="container py-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">{SITE.coursesSection.title}</h2>
          <p className="text-muted-foreground">{SITE.coursesSection.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {SITE.courses.map((c) => (
            <a key={c.title} href={c.link} className="group bg-card rounded-3xl p-7 border border-border hover-scale shadow-sm block">
              <div className="text-4xl mb-5">{c.emoji}</div>
              <span className="text-xs font-semibold text-primary bg-secondary px-3 py-1 rounded-full">{c.level}</span>
              <h3 className="font-display font-bold text-xl mt-4 mb-2">{c.title}</h3>
              <p className="text-muted-foreground text-sm">{c.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" className="gradient-pink py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">{SITE.templatesSection.title}</h2>
            <p className="text-muted-foreground">{SITE.templatesSection.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SITE.templates.map((t) => (
              <a key={t.title} href={t.link} className="bg-white rounded-3xl p-6 hover-scale shadow-sm block">
                <div className="text-4xl mb-4">{t.emoji}</div>
                <span className="text-xs font-semibold text-muted-foreground">{t.tag}</span>
                <h3 className="font-display font-bold text-lg mt-1 mb-2">{t.title}</h3>
                <p className="text-muted-foreground text-sm">{t.desc}</p>
              </a>
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
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">{SITE.aiSection.title}</h2>
            <p className="text-muted-foreground mb-6 max-w-md">{SITE.aiSection.subtitle}</p>
            <ul className="space-y-3">
              {SITE.aiSection.features.map((f) => (
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
                  {SITE.aiSection.botGreeting}
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
                placeholder={SITE.aiSection.inputPlaceholder}
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
              <span key={i} className="absolute text-2xl opacity-20 animate-float" style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 3) * 30}%`, animationDelay: `${i * 0.4}s` }}>{s}</span>
            ))}
          </div>
          <div className="relative z-10">
            <div className="text-5xl mb-5">🍒</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">{SITE.accessSection.title}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">{SITE.accessSection.subtitle}</p>
            <a href={SITE.links.socialPayment} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full text-base px-8 py-6">
                {SITE.accessSection.button}
              </Button>
            </a>
            <p className="text-xs text-muted-foreground mt-4">{SITE.accessSection.note}</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display font-bold text-foreground">
            🍬 {SITE.name} 🍒
          </div>
          <p>© {SITE.year} {SITE.name} — {SITE.tagline}</p>
          <div className="flex gap-2 text-lg">🍬 🍒 🫧</div>
        </div>
      </footer>

    </div>
  );
};

export default Index;