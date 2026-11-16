'use client';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { slides, type Theme } from '@/data/slidesData';
import SlideView from './SlideView';
import { DarkBackdrop, FmsBackdrop, TeamScene, YariiBackdrop, YARII_FRAMES } from './Backdrops';
const pad = (n: number) => String(n).padStart(2, '0');

/** Загварууд — өнгө, фонт (сайтуудаас авсан). Энд солино. */
type T = Record<string, string>;
const THEMES: Record<Theme, T> = {
  get team() { return { ...this.dark, tshadow: '0 4px 30px rgba(0,0,0,.6)' }; },
  dark: {
    bg: '#0A0B10', fg: '#F5F1E6', accent: '#D4AF37', fontH: 'Unbounded', fontB: 'Manrope', tt: 'uppercase', ls: '-0.02em', fw: '900',
    pillBg: '#F5F1E6', pillFg: '#0A0B10', card: '#F5F1E6', cardFg: '#0A0B10', cardShadow: 'none',
    btn: '#D4AF37', btnFg: '#0A0B10', btnR: '999px', btnShadow: '0 0 50px -8px rgba(212,175,55,.8)',
    icon1: '#D4AF37', icon2: '#D4AF37', icon3: '#D4AF37', iconFg: '#0A0B10', bad: '#EF4444', badFg: '#fff', ok: '#22C55E', okFg: '#fff', tshadow: 'none',
  },
  /* find-my-school-rho.vercel.app */
  fms: {
    bg: '#17151F', fg: '#F1EEF6', accent: '#EFC081', fontH: 'Geologica', fontB: 'Commissioner', tt: 'none', ls: '-0.035em', fw: '700',
    pillBg: '#2A2837', pillFg: '#BCB9F4', card: 'rgba(42,40,55,.85)', cardFg: '#F1EEF6', cardShadow: '0 18px 40px -18px rgba(0,0,0,.6)',
    btn: '#BCB9F4', btnFg: '#1F1D29', btnR: '12px', btnShadow: '0 12px 40px -12px rgba(188,185,244,.7)',
    icon1: '#E0DDF9', icon2: '#D2C1CE', icon3: '#EFC081', iconFg: '#2F2C3D', bad: '#EAAAC8', badFg: '#2F2C3D', ok: '#A3D6C7', okFg: '#1F1D29', tshadow: '0 4px 40px rgba(23,21,31,.8)',
  },
  /* mongolingo-vedg.vercel.app */
  yarii: {
    bg: '#E8DFE0', fg: '#3A2A1F', accent: '#875530', fontH: 'Montserrat', fontB: 'Onest', tt: 'none', ls: '-0.045em', fw: '800',
    pillBg: 'rgba(255,253,251,.85)', pillFg: '#3A2A1F', card: 'rgba(255,253,251,.82)', cardFg: '#3A2A1F', cardShadow: '0 24px 40px -28px rgba(30,20,12,.6)',
    btn: '#8F5B34', btnFg: '#F6ECE0', btnR: '999px', btnShadow: '0 14px 30px -14px rgba(107,68,38,.8)',
    icon1: '#5E6B42', icon2: '#4E5F69', icon3: '#6B4426', iconFg: '#F6ECE0', bad: '#9B3D2E', badFg: '#F6ECE0', ok: '#5E6B42', okFg: '#F6ECE0', tshadow: '0 2px 40px rgba(246,236,224,.65)',
    glowFg: '#3A2A1F', glow: '0 0 24px rgba(255,244,228,.95), 0 0 60px rgba(255,236,210,.7)', qColor: '#FFF4E2', qGlow: '0 0 30px rgba(255,236,200,.95), 0 0 90px rgba(255,214,160,.7)',
  },
};

/** Слайд хоорондын шилжилт — загвар бүрт өөр */
const TRANSITIONS = {
  dark: { i: (d: number) => ({ opacity: 0, x: d * 100 }), e: (d: number) => ({ opacity: 0, x: d * -100 }) },
  fms: { i: (d: number) => ({ opacity: 0, scale: 0.9, y: d * 60, rotateX: 12 }), e: (d: number) => ({ opacity: 0, scale: 1.08, y: d * -60, rotateX: -8 }) },
  yarii: { i: (d: number) => ({ opacity: 0, x: d * 120, rotate: d * 1.4 }), e: (d: number) => ({ opacity: 0, x: d * -120, rotate: d * -1.4 }) },
  team: { i: (d: number) => ({ opacity: 0, x: d * 60 }), e: (d: number) => ({ opacity: 0, x: d * -40 }) },
};

export default function Deck() {
  const total = slides.length;
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const goTo = useCallback((n: number) => setState(([c]) => {
    const t = Math.max(0, Math.min(total - 1, n));
    return t === c ? [c, 0] : [t, t > c ? 1 : -1];
  }), [total]);
  const step = useCallback((d: number) => setState(([c]) => {
    const t = Math.max(0, Math.min(total - 1, c + d));
    return t === c ? [c, 0] : [t, d];
  }), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
      if (e.key === 'Home') goTo(0);
      if (e.key === 'End') goTo(total - 1);
      if (e.key === 'f' || e.key === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, goTo, total]);

  const slide = slides[index];
  const fmsStep = slides.slice(0, index + 1).filter((s) => s.theme === 'fms').length - 1;
  const yStep = slides.slice(0, index + 1).filter((s) => s.theme === 'yarii').length - 1;
  const night = slide.theme === 'yarii' && YARII_FRAMES[Math.min(yStep, YARII_FRAMES.length - 1)]?.dark;
  /** Yarii шөнийн кадр дээр текст цайвар болно */
  const t = night ? { ...THEMES.yarii, fg: '#F6ECE0', accent: '#E8C9A0', pillBg: 'rgba(246,236,224,.14)', pillFg: '#F6ECE0', tshadow: '0 2px 30px rgba(0,0,0,.55)', glowFg: '#FFF4E2', glow: '0 0 14px rgba(255,236,200,.95), 0 0 44px rgba(255,214,160,.7), 0 0 90px rgba(255,200,140,.35)' } : THEMES[slide.theme];
  const vars = Object.fromEntries(Object.entries(t).map(([k, v]) => [`--${k}`, v])) as React.CSSProperties;
  const fonts = { fontFamily: `${t.fontB}, system-ui, sans-serif`, ['--font-h' as string]: `${t.fontH}` } as React.CSSProperties;
  const tr = TRANSITIONS[slide.theme];

  return (
    <motion.main animate={{ backgroundColor: t.bg, color: t.fg }} transition={{ duration: 0.6 }}
      style={{ ...vars, ...fonts }} className="relative h-[100dvh] w-full overflow-hidden">
      {/* Backgrounds */}
      <AnimatePresence>
        <motion.div key={slide.theme} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          {slide.theme === 'team' ? <TeamScene focus={slide.type === 'member' ? slide.idx : -1} /> : slide.theme === 'fms' ? <FmsBackdrop step={fmsStep} /> : slide.theme === 'yarii' ? <YariiBackdrop step={yStep} dir={dir || 1} /> : <DarkBackdrop />}
        </motion.div>
      </AnimatePresence>

      {/* Header */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-12">
        <p className="font-display text-xs font-black uppercase tracking-[0.25em]">8W · 2P</p>
        <p className="font-display text-xs font-bold tracking-[0.2em]">{pad(index + 1)} <span className="opacity-40">/ {pad(total)}</span></p>
      </div>

      {/* Slide */}
      <div className="absolute inset-0 z-10 overflow-y-auto">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section key={slide.id}
            initial={tr.i(dir || 1)} animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0 }} exit={tr.e(dir || 1)}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} style={{ transformPerspective: 1200 }}
            className={`flex min-h-full items-center px-6 pt-20 md:px-12 ${slide.theme === 'yarii' ? 'pb-40' : 'pb-24'}`}>
            <SlideView slide={slide} onNext={() => step(1)} onRestart={() => goTo(0)} />
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-4 px-6 pb-5 md:px-12">
        <div className="flex flex-1 gap-1">
          {slides.map((s, i) => (
            <button key={s.id} aria-label={`Slide ${i + 1}`} onClick={() => goTo(i)} className="h-4 flex-1 py-1.5">
              <span className="block h-full rounded-full transition-all duration-500" style={{ background: 'var(--fg)', opacity: i <= index ? 1 : 0.18 }} />
            </button>
          ))}
        </div>
        {[{ d: -1, I: ChevronLeft, off: index === 0 }, { d: 1, I: ChevronRight, off: index === total - 1 }].map(({ d, I, off }) => (
          <button key={d} onClick={() => step(d)} disabled={off} aria-label={d < 0 ? 'Previous' : 'Next'}
            className="grid h-11 w-11 place-items-center rounded-full border-2 transition hover:scale-110 disabled:opacity-20"
            style={{ borderColor: 'var(--fg)' }}>
            <I size={20} />
          </button>
        ))}
      </div>
    </motion.main>
  );
}
