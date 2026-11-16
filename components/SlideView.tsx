'use client';
import { createContext, useContext, useEffect } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type Variants } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Crown, RotateCcw, X } from 'lucide-react';
import type { Slide, Theme } from '@/data/slidesData';
import { STATS, TEAM } from '@/data/slidesData';
import ImageFrame from './ImageFrame';
import { GlowLetters, Typewriter, WordIn } from './Text';

const ThemeCtx = createContext<Theme>('dark');
/** Гарчгийн анимаци: fms → үг эргэх, yarii → бичигдэх */
function Animated({ text }: { text: string }) {
  const t = useContext(ThemeCtx);
  if (t === 'fms') return <WordIn text={text} />;
  if (t === 'yarii') return <GlowLetters text={text} />;
  return <>{text}</>;
}

const wrap: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 16 } },
};
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -8 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 140, damping: 14 } },
};

/** Хөвөх анимаци */
const Float = ({ children, d = 0, amp = 14, className = '' }: { children: React.ReactNode; d?: number; amp?: number; className?: string }) => (
  <motion.div className={className} animate={{ y: [0, -amp, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: d }}>
    {children}
  </motion.div>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <motion.span variants={item} className="mb-6 inline-block rounded-full px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.2em]"
    style={{ background: 'var(--pillBg)', color: 'var(--pillFg)' }}>{children}</motion.span>
);
const hStyle = { textTransform: 'var(--tt)', letterSpacing: 'var(--ls)', fontWeight: 'var(--fw)', textShadow: 'var(--tshadow)' } as React.CSSProperties;
const H = ({ children, className = '' }: { children: string; className?: string }) => (
  <motion.h2 variants={item} style={hStyle} className={`font-display text-4xl leading-[1] md:text-6xl lg:text-7xl ${className}`}><Animated text={children} /></motion.h2>
);
const Accent = ({ children }: { children: React.ReactNode }) => <span style={{ color: 'var(--accent)' }}>{children}</span>;

const wholeNumber = new Intl.NumberFormat('en-US');

function CountUp({ value, currency = false }: { value: number; currency?: boolean }) {
  const count = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const format = (number: number) => `${number < 0 ? '−' : ''}${currency ? '₮' : ''}${wholeNumber.format(Math.abs(number))}`;
  const display = useTransform(count, (number) => format(Math.round(number)));

  useEffect(() => {
    if (reduceMotion) return;
    count.set(0);
    const animation = animate(count, value, { delay: 0.4, duration: 1.3, ease: 'easeOut' });
    return () => animation.stop();
  }, [count, reduceMotion, value]);

  const total = format(value);
  if (reduceMotion) return <>{total}</>;

  return (
    <span className="relative inline-grid whitespace-nowrap tabular-nums">
      <span className="sr-only">{total}</span>
      <span aria-hidden="true" className="invisible [grid-area:1/1]">{total}</span>
      <motion.span aria-hidden="true" className="[grid-area:1/1]">{display}</motion.span>
    </span>
  );
}

function GoldButton({ href, onClick, children, icon = 'link' }: { href?: string; onClick?: () => void; children: React.ReactNode; icon?: 'link' | 'next' }) {
  const cls = 'group inline-flex items-center gap-3 px-8 py-5 font-display text-sm font-bold tracking-wide [background:var(--btn)] [color:var(--btnFg)] [border-radius:var(--btnR)] [box-shadow:var(--btnShadow)]';
  const I = icon === 'link' ? ArrowUpRight : ArrowRight;
  const inner = <>{children}<I size={20} className="transition group-hover:translate-x-1" /></>;
  return href
    ? <motion.a variants={item} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</motion.a>
    : <motion.button variants={item} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} onClick={onClick} className={cls}>{inner}</motion.button>;
}

/* ═══ Yarii: гэрэлтэй самбар (ДЭЛГҮҮР, АВТОБУС шиг) ═══ */
const SIGN_TONES = [
  { bg: 'linear-gradient(180deg,#F4EAD6,#E3D3B6)', fg: '#5A4632' },
  { bg: 'linear-gradient(180deg,#7E9C78,#5F7D5A)', fg: '#F7F3E8' },
  { bg: 'linear-gradient(180deg,#9DB0BF,#7890A2)', fg: '#F7F3E8' },
];
function Sign({ title, tag, i, icon: Icon, bad, ok, big }: { title: string; tag?: string; i: number; icon?: React.ElementType; bad?: boolean; ok?: boolean; big?: boolean }) {
  const tone = bad ? { bg: 'linear-gradient(180deg,#8E8278,#6F655D)', fg: '#EDE6DC' } : SIGN_TONES[i % 3];
  return (
    <motion.div variants={pop} className="flex flex-col items-center">
      <motion.div style={{ transformOrigin: '50% 100%' }} animate={{ rotate: [-1.2, 1.2, -1.2] }} transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center">
        <div className={`${bad ? 'sign-broken' : 'sign-on'} relative`} style={{ animationDelay: `${0.3 + i * 0.35}s, ${1.9 + i * 0.35}s` }}>
          <div className={`relative flex items-center gap-4 rounded-2xl border-[3px] border-[#FFF8EC] ${big ? 'px-10 py-7' : 'px-8 py-5'}`}
            style={{ background: tone.bg, color: tone.fg, boxShadow: '0 0 0 2px rgba(255,255,255,.35), 0 0 34px rgba(255,226,180,.65), inset 0 0 22px rgba(255,255,255,.35)' }}>
            {Icon && <Icon size={big ? 34 : 28} strokeWidth={2.2} className="shrink-0 opacity-80" />}
            <span className={`font-display font-extrabold uppercase leading-tight tracking-tight ${big ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>{title}</span>
            <span className="absolute inset-x-4 bottom-1.5 flex justify-between">
              {Array.from({ length: 14 }).map((_, k) => <span key={k} className="h-1 w-1 rounded-full bg-white/70" />)}
            </span>
          </div>
          {bad && <span className="absolute -right-4 -top-4 grid h-12 w-12 place-items-center rounded-full bg-red-500 text-white shadow-xl"><X size={26} strokeWidth={4} /></span>}
          {ok && <span className="absolute -right-4 -top-4 grid h-11 w-11 place-items-center rounded-full bg-[#5E6B42] text-[#F6ECE0] shadow-xl"><Check size={22} strokeWidth={4} /></span>}
        </div>
        <div className="h-16 w-2 rounded-b bg-gradient-to-b from-[#3A2A1F] to-[#3A2A1F]/40" />
      </motion.div>
      {tag && <p className="mt-4 text-xl font-bold" style={{ textShadow: 'var(--tshadow)' }}>{tag}</p>}
    </motion.div>
  );
}

export default function SlideView({ slide, onNext, onRestart }: { slide: Slide; onNext: () => void; onRestart: () => void }) {
  return (
    <ThemeCtx.Provider value={slide.theme}>
    <motion.div variants={wrap} initial="hidden" animate="show" className="mx-auto w-full max-w-6xl">
      {render(slide, onNext, onRestart)}
    </motion.div>
    </ThemeCtx.Provider>
  );
}

function render(s: Slide, onNext: () => void, onRestart: () => void) {
  switch (s.type) {
    case 'cover':
      return (
        <div className="relative text-center">
          <motion.div variants={pop} className="pointer-events-none absolute -left-24 -top-16 hidden w-64 -rotate-12 opacity-70 md:block lg:w-96"><Float><ImageFrame src={s.imgs[0]} ratio="16:10" /></Float></motion.div>
          <motion.div variants={pop} className="pointer-events-none absolute -right-24 -bottom-16 hidden w-64 rotate-12 opacity-70 md:block lg:w-96"><Float d={1.5}><ImageFrame src={s.imgs[1]} ratio="16:10" /></Float></motion.div>
          <div className="relative py-16">
            <Pill>{s.kicker}</Pill>
            <motion.h1 variants={item} style={hStyle} className="font-display text-6xl leading-[0.9] md:text-8xl lg:text-9xl">
              {s.title[0]}<br /><Accent>{s.title[1]}</Accent>
            </motion.h1>
            <motion.p variants={item} className="mb-10 mt-6 font-display text-lg font-bold opacity-70 md:text-xl">{s.subtitle}</motion.p>
            <GoldButton onClick={onNext} icon="next">{s.cta}</GoldButton>
          </div>
        </div>
      );

    case 'team':
      return (
        <>
          <H className="mb-12 text-center">{s.title}</H>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {s.members.map((m, i) => (
              <motion.div key={i} variants={pop} className="text-center">
                <Float d={i * 0.4} amp={10}><ImageFrame src={m.img} ratio="3:4" className={i % 2 ? 'rotate-2' : '-rotate-2'} /></Float>
                <p contentEditable suppressContentEditableWarning style={hStyle} className="mt-5 font-display text-xl outline-none">{m.name}</p>
                <p contentEditable suppressContentEditableWarning className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider outline-none"
                  style={{ background: 'var(--accent)', color: 'var(--bg)' }}>{m.role}</p>
              </motion.div>
            ))}
          </div>
        </>
      );

    case 'teamGroup':
      return (
        <div className="w-[42%] text-center">
          <Pill>{s.eyebrow}</Pill>
          <H className="text-6xl md:text-8xl">{s.title}</H>
          <motion.p variants={item} className="mt-4 font-display text-lg font-bold opacity-80 md:text-xl" style={{ textShadow: 'var(--tshadow)' }}>{s.subtitle}</motion.p>
        </div>
      );

    case 'member': {
      const m = TEAM.members[s.idx];
      const nameParts = m.name.split(' ');
      const givenName = nameParts.pop() ?? '';
      const patronymic = nameParts.join(' ');
      return (
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_minmax(0,1fr)]">
          <div />
          <motion.div key={s.idx} className="[container-type:inline-size]" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, type: 'spring', stiffness: 80, damping: 16 }}>
            <p className="mb-6 font-display text-sm font-bold tracking-[0.3em] opacity-60">{String(s.idx + 1).padStart(2, '0')} / {String(TEAM.members.length).padStart(2, '0')}</p>
            <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8, type: 'spring' }}
              className={`mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2 font-display text-sm font-bold uppercase tracking-wider ${'lead' in m && m.lead ? 'bg-[#D4AF37] text-[#0A0B10] shadow-[0_0_40px_-6px_rgba(212,175,55,.9)]' : 'bg-white/10 text-[#F5F1E6] ring-1 ring-white/20'}`}>
              {'lead' in m && m.lead && <Crown size={16} />}{m.role}
            </motion.span>
            <h2 contentEditable suppressContentEditableWarning style={hStyle} className="font-display leading-[1.05] outline-none">
              {patronymic && (
                <span className="mb-2 block text-[clamp(1.125rem,8cqw,3rem)]">
                  <WordIn text={patronymic} delay={0.7} />
                </span>
              )}
              <span className="block text-[clamp(1.75rem,11cqw,5rem)]">
                <WordIn text={givenName} delay={0.79} />
              </span>
            </h2>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="my-6 h-1 w-32 origin-left rounded-full bg-[#D4AF37]" />
          </motion.div>
        </div>
      );
    }

    case 'split':
      return (
        <>
          <H className="mb-12 text-center">{s.title}</H>
          <div className="grid gap-10 md:grid-cols-2">
            {s.projects.map((p, i) => (
              <motion.div key={p.name} variants={pop} whileHover={{ rotate: 0, scale: 1.03 }} className={i ? 'rotate-2' : '-rotate-2'}>
                <Float d={i * 1.2}><ImageFrame src={p.img} ratio="16:10" /></Float>
                <p style={hStyle} className="mt-6 font-display text-3xl md:text-4xl">{p.name}</p>
                <p className="mt-1 font-bold opacity-60">{p.tag}</p>
              </motion.div>
            ))}
          </div>
        </>
      );

    case 'title':
      return (
        <div className="text-center">
          <motion.h1 variants={wrap} style={hStyle} className="font-display text-[clamp(2.5rem,min(12vw,16vh),8.5rem)] leading-[1.05]">
            <motion.span variants={item} className="block">{s.title[0]}</motion.span>{' '}
            <motion.span variants={item} className="block" style={{ color: 'var(--accent)' }}>{s.title[1]}</motion.span>
          </motion.h1>
          <motion.div aria-hidden="true" variants={item} className="mx-auto mt-8 h-px w-36 bg-gradient-to-r from-transparent via-[#EFC081] to-transparent" />
        </div>
      );

    case 'hero':
      return (
        <div className={s.img ? 'grid items-center gap-7 md:grid-cols-2 md:gap-10' : 'text-center'}>
          <div>
            <Pill>{s.eyebrow}</Pill>
            <motion.h1 variants={item} style={hStyle} className={s.img
              ? 'font-display text-[clamp(2rem,4.2vw,3.75rem)] leading-[1.08]'
              : 'font-display text-6xl leading-[0.95] md:text-8xl'}>
              <Animated text={s.title} />
            </motion.h1>
            <motion.p variants={item} className="mt-6 font-display text-xl font-bold opacity-80 md:text-2xl">{s.subtitle}</motion.p>
          </div>
          {s.img && (
            <motion.div variants={pop}>
              <ImageFrame src={s.img} ratio="4:3" className="ring-1 ring-white/20" />
            </motion.div>
          )}
        </div>
      );

    case 'stats': {
      const [main, ...rest] = STATS;
      const sourceClass = 'text-sm opacity-70 underline decoration-white/40 underline-offset-4 hover:opacity-100';
      return (
        <div className="grid items-center gap-x-12 gap-y-8 lg:grid-cols-[1.2fr_1fr]"
          style={{ textShadow: '0 1px 3px var(--bg), 0 0 8px var(--bg)' }}>
          <div>
            <H>{s.title}</H>
            <motion.p variants={pop} style={hStyle} className="mt-6 font-display text-[clamp(2.75rem,10vw,7rem)] leading-none"><Accent>{main.value}</Accent></motion.p>
            <motion.p variants={item} className="font-display text-xl font-bold md:text-2xl">{main.label}</motion.p>
            <motion.p variants={item} className="mt-2">
              <a className={sourceClass} href={main.sourceUrl} target="_blank" rel="noopener noreferrer">{main.source}</a>
            </motion.p>
          </div>
          <div className="space-y-8">
            {rest.map((stat) => (
              <motion.div key={stat.label} variants={item} className="border-t border-white/20 pt-6">
                <p style={hStyle} className="font-display text-5xl md:text-6xl">{stat.value}</p>
                <p className="mt-2 text-xl font-bold">{stat.label}</p>
                <p className="mt-1">
                  <a className={sourceClass} href={stat.sourceUrl} target="_blank" rel="noopener noreferrer">{stat.source}</a>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    case 'arrivals': {
      const total = s.purposes.reduce((sum, purpose) => sum + purpose.value, 0);
      return (
        <div className="mx-auto max-w-6xl text-center">
          <motion.h2 variants={item} className="font-display text-2xl font-bold leading-tight md:text-4xl">{s.title}</motion.h2>
          <motion.div variants={item} className="mt-6 md:mt-8">
            <p className="font-display text-[clamp(3.5rem,12vw,10rem)] font-black leading-none tracking-tight text-[#E8CB9D] tabular-nums">
              {total.toLocaleString('en-US')}
            </p>
            <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer"
              title="Эх сурвалж: ҮСХ · ХХЕГ" className="mt-2 inline-block text-lg font-semibold text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white md:text-xl">
              {s.year} оны нийт ирэлт
            </a>
          </motion.div>
          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-white/15 pt-6 md:mt-12 md:grid-cols-4 md:pt-8">
            {s.purposes.map(({ label, value }) => (
              <motion.div key={label} variants={item} className="flex flex-col-reverse gap-2">
                <dt className="text-sm font-semibold text-white/75 md:text-base">{label}</dt>
                <dd className="font-display text-[clamp(1.65rem,4vw,3.5rem)] font-bold leading-none tabular-nums">{value.toLocaleString('en-US')}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      );
    }

    case 'cards': {
      const problem = s.variant === 'problem';
      const two = s.cards.length === 2;
      if (s.theme === 'yarii') return (
        <>
          <div className="mb-16 text-center"><Pill>{s.eyebrow}</Pill><H>{s.title}</H></div>
          <div className="flex flex-wrap items-end justify-center gap-x-12 gap-y-10 lg:flex-nowrap">
            {s.cards.map((c, i) => <Sign key={i} i={i} title={c.title} tag={c.tag} icon={c.icon} bad={c.bad} ok={s.variant === 'solution'} big={two} />)}
          </div>
        </>
      );
      return (
        <>
          <div className="mb-14 text-center"><Pill>{s.eyebrow}</Pill><H>{s.title}</H></div>
          <div className={`grid gap-12 ${two ? 'mx-auto max-w-5xl md:grid-cols-2' : 'md:grid-cols-3'}`}>
            {s.cards.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div key={i} variants={pop} className="group relative text-center">
                  <Float d={i * 0.5} amp={12} className="relative mx-auto mb-8 w-fit">
                    <motion.div whileHover={{ scale: 1.08, rotate: i % 2 ? 6 : -6 }}
                      className={`relative grid place-items-center rounded-full shadow-[0_30px_60px_-20px_rgba(0,0,0,.45)] ${two ? 'h-44 w-44' : 'h-36 w-36'}`}
                      style={problem ? { background: 'var(--bad)', color: 'var(--badFg)' } : { background: `var(--icon${(i % 3) + 1})`, color: 'var(--iconFg)' }}>
                      <motion.span className="absolute inset-0 rounded-full" style={{ border: '2px solid currentColor', opacity: 0.35 }}
                        animate={{ scale: [1, 1.35], opacity: [0.4, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }} />
                      <Icon size={two ? 80 : 64} strokeWidth={1.6} />
                    </motion.div>
                    {c.bad && (
                      <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: [0, 1.3, 1], rotate: 0 }} transition={{ delay: 0.7 + i * 0.25 }}
                        className="absolute -right-2 -top-2 grid h-14 w-14 place-items-center rounded-full bg-red-500 text-white shadow-xl"><X size={30} strokeWidth={4} /></motion.span>
                    )}
                    {s.variant === 'solution' && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 0.7 + i * 0.25 }}
                        className="absolute -right-1 -top-1 grid h-12 w-12 place-items-center rounded-full shadow-xl" style={{ background: 'var(--ok)', color: 'var(--okFg)' }}><Check size={24} strokeWidth={4} /></motion.span>
                    )}
                  </Float>
                  <p style={hStyle} className={`font-display leading-[1.05] ${two ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'}`}>{c.title}</p>
                  {c.tag && <p className="mt-4 text-lg font-semibold opacity-75 md:text-xl" style={{ textShadow: 'var(--tshadow)' }}>{c.tag}</p>}
                </motion.div>
              );
            })}
          </div>
        </>
      );
    }

    case 'question': {
      const t = s.title.replace('?', '');
      return (
        <div className="text-center">
          <Pill>{s.eyebrow}</Pill>
          <motion.h1 variants={item} style={hStyle} className="font-display text-6xl leading-none md:text-8xl lg:text-9xl"><Animated text={t.trim()} /></motion.h1>
          <motion.div variants={pop} className="mt-4">
            <motion.span className="inline-block font-display text-[10rem] font-black leading-none md:text-[14rem]" style={{ color: 'var(--qColor, var(--accent))', textShadow: 'var(--qGlow, none)' }}
              animate={{ rotate: [-8, 8, -8], y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>?</motion.span>
          </motion.div>
        </div>
      );
    }

    case 'demo':
      return (
        <div className="text-center">
          <Pill>{s.eyebrow}</Pill>
          <H className="text-4xl md:text-5xl lg:text-6xl">{s.title}</H>
          <motion.p variants={item} className="mb-8 mt-4 font-display text-lg font-bold opacity-70">{s.subtitle}</motion.p>
          {s.showQr && (
            <motion.div variants={item} className="mb-8 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="QR" className="h-28 w-28 rounded-2xl bg-white p-2"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=4&data=${encodeURIComponent(s.url)}`} />
            </motion.div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GoldButton href={s.url}>{s.cta}</GoldButton>
            {s.restart && (
              <motion.button variants={item} onClick={onRestart} whileHover={{ scale: 1.06 }}
                className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-5 font-display text-sm font-bold uppercase" style={{ borderColor: 'var(--fg)' }}>
                <RotateCcw size={18} />Дахин
              </motion.button>
            )}
          </div>
        </div>
      );

    case 'pricing':
      return (
        <>
          <div className="mb-8 text-center"><Pill>{s.eyebrow}</Pill><H className="lg:!text-6xl">{s.title}</H></div>
          <div className="mx-auto grid max-w-5xl items-center gap-x-12 gap-y-8 md:grid-cols-2">
            <motion.div variants={item}>
              <p className="mb-3 text-lg font-bold opacity-75" style={{ textShadow: 'var(--tshadow)' }}>{s.ai.title}</p>
              <p style={hStyle} className="font-display text-2xl leading-tight md:text-3xl">🇲🇳 {s.ai.from}</p>
              <motion.div className="my-2 h-5 w-[3px] rounded-full" style={{ background: 'var(--accent)', transformOrigin: 'top' }}
                animate={{ scaleY: [0, 1, 1], opacity: [1, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
              <p style={{ ...hStyle, color: 'var(--accent)' }} className="font-display text-2xl leading-tight md:text-3xl">
                {s.theme === 'yarii' ? <>🇬🇧 <GlowLetters text={s.ai.to} delay={1.2} /></> : <Typewriter text={`🇬🇧 ${s.ai.to}`} delay={1400} speed={45} />}
              </p>
            </motion.div>
            <motion.div variants={pop} className="text-center md:text-left">
              <p style={{ textShadow: 'var(--tshadow)' }} className="font-display text-5xl font-bold leading-none md:text-6xl">
                <Accent><CountUp value={s.plan.price} currency /></Accent> <span className="text-lg opacity-80">/ сар</span>
              </p>
              <div className="my-4 flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-start">
                {s.plan.features.map((f) => <span key={f} className="flex items-center gap-1.5 text-sm font-bold" style={{ textShadow: 'var(--tshadow)' }}><Check size={16} strokeWidth={3} style={{ color: 'var(--accent)' }} />{f}</span>)}
              </div>
              <GoldButton href={s.plan.url}>{s.plan.cta}</GoldButton>
            </motion.div>
          </div>
          <motion.p variants={item} style={{ textShadow: 'var(--tshadow)' }}
            className="mx-auto mt-8 max-w-5xl border-t border-current/20 pt-5 text-center font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            <Accent><CountUp value={s.paidUsers} /></Accent>{' хэрэглэгч + ашиг'}
          </motion.p>
        </>
      );

  }
}
