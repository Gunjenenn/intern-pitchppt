'use client';
import { useEffect, useRef, useState } from 'react';
import { TEAM } from '@/data/slidesData';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';

/* ══════════ Хулганы parallax ══════════ */
function usePointer() {
  const x = useMotionValue(0), y = useMotionValue(0);
  useEffect(() => {
    const f = (e: PointerEvent) => { x.set(e.clientX / innerWidth - 0.5); y.set(e.clientY / innerHeight - 0.5); };
    addEventListener('pointermove', f);
    return () => removeEventListener('pointermove', f);
  }, [x, y]);
  return { x: useSpring(x, { stiffness: 40, damping: 20 }), y: useSpring(y, { stiffness: 40, damping: 20 }) };
}

/* ══════════ FIND MY SCHOOL — story хэсгийн 3D пастел дүрсүүд + алтан зам ══════════ */
const BLOBS = [
  { c: '#E0DDF9', side: '#BDB9E8', r: '62% 38% 46% 54% / 44% 58% 42% 56%', s: 17, depth: 1 },
  { c: '#D2C1CE', side: '#B5A1B0', r: '40% 60% 58% 42% / 55% 45% 60% 40%', s: 13, depth: 0.7 },
  { c: '#AD9A93', side: '#8E7B74', r: '55% 45% 38% 62% / 48% 62% 38% 52%', s: 9, depth: 0.45 },
  { c: '#8F7769', side: '#715B4E', r: '48% 52% 60% 40% / 40% 55% 45% 60%', s: 7, depth: 0.3 },
];
/** [left%, top%, scale, rotateX, rotateY] — слайд бүрт дүрсүүд энд нисч очно */
const LAYOUTS: number[][][] = [
  [[4, 12, 1, 0, 0], [76, 60, 1, 0, 0], [70, 14, 1, 0, 0], [14, 74, 1, 0, 0]],
  [[74, 6, 1.25, 35, 40], [2, 58, 0.9, -20, 30], [46, 80, 0.8, 20, -40], [90, 72, 1, 0, 60]],
  [[-6, 46, 1.5, -30, 60], [82, 14, 0.85, 40, -20], [30, 2, 0.7, 10, 50], [68, 82, 1.1, -40, 0]],
  [[68, 60, 1.15, 50, -30], [8, 6, 1, -10, 70], [88, 2, 0.9, 30, 30], [2, 84, 0.8, 0, -50]],
  [[40, -10, 1.4, 20, 80], [-4, 70, 1, 40, -40], [86, 40, 0.9, -30, 20], [60, 86, 0.7, 10, 40]],
];
/** Алтан зам (SVG) — слайд бүрт өөр муруй зурагдана */
const ROADS = [
  'M -50 700 C 300 640, 420 380, 760 420 S 1200 260, 1500 300',
  'M -50 200 C 260 320, 520 160, 760 300 S 1180 620, 1500 560',
  'M -50 520 C 240 420, 380 700, 720 600 S 1100 200, 1500 240',
  'M -50 380 C 320 260, 560 560, 860 460 S 1240 380, 1500 160',
  'M -50 640 C 360 700, 520 260, 800 320 S 1200 520, 1500 420',
];

function Blob3D({ b, l, step, i, px, py }: { b: typeof BLOBS[0]; l: number[]; step: number; i: number; px: MotionValue<number>; py: MotionValue<number> }) {
  const tx = useTransform(px, (v) => v * 60 * b.depth * 2);
  const ty = useTransform(py, (v) => v * 40 * b.depth * 2);
  const layers = 7;
  return (
    <motion.div className="absolute" style={{ x: tx, y: ty, width: `${b.s}vw`, height: `${b.s}vw`, transformStyle: 'preserve-3d', filter: b.depth < 0.5 ? 'blur(1.5px)' : 'none' }}
      animate={{ left: `${l[0]}%`, top: `${l[1]}%`, scale: l[2], rotateX: l[3], rotateY: l[4], rotateZ: step * 70 + i * 35 }}
      transition={{ type: 'spring', stiffness: 30, damping: 12, mass: 1.4 }}>
      <motion.div className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -16, 0], rotateZ: [0, 6, 0] }} transition={{ duration: 7 + i * 1.3, repeat: Infinity, ease: 'easeInOut' }}>
        {/* Зузаан (3D хажуу тал) */}
        {Array.from({ length: layers }).map((_, k) => (
          <span key={k} className="absolute inset-0" style={{ borderRadius: b.r, background: k === layers - 1 ? b.c : b.side, transform: `translateZ(${k * 4}px)` }} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function Stops({ road }: { road: string }) {
  const ref = useRef<SVGPathElement>(null);
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    const p = ref.current; if (!p) return;
    const L = p.getTotalLength();
    setPts([0.25, 0.55, 0.85].map((t) => { const q = p.getPointAtLength(L * t); return { x: q.x, y: q.y }; }));
  }, [road]);
  return (
    <>
      <path ref={ref} d={road} fill="none" stroke="none" />
      {pts.map((q, k) => (
        <motion.circle key={k} cx={q.x} cy={q.y} r={12} fill="#2A2837" stroke={['#BCB9F4', '#EAAAC8', '#A3D6C7'][k]} strokeWidth={5}
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
          style={{ transformOrigin: `${q.x}px ${q.y}px` }}
          transition={{ delay: 0.6 + k * 0.45, type: 'spring', stiffness: 300, damping: 14 }} />
      ))}
    </>
  );
}

export function FmsBackdrop({ step }: { step: number }) {
  const { x, y } = usePointer();
  const L = LAYOUTS[step % LAYOUTS.length];
  const road = ROADS[step % ROADS.length];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#17151F]" style={{ perspective: 1400 }}>
      <motion.div className="absolute inset-0" animate={{ background: `radial-gradient(90% 70% at ${30 + (step % 3) * 20}% ${15 + (step % 2) * 20}%, rgba(224,221,249,.16), transparent 70%)` }} transition={{ duration: 1.4 }} />

      {/* Алтан зам + зогсоолууд */}
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-60">
        <AnimatePresence mode="wait">
          <motion.g key={step}>
            <motion.path d={road} fill="none" stroke="#EFC081" strokeWidth={6} strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ pathLength: { duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.3 }, opacity: { duration: 0.4 } }} />
            <Stops road={road} />
          </motion.g>
        </AnimatePresence>
      </svg>

      {BLOBS.map((b, i) => <Blob3D key={i} b={b} l={L[i]} step={step} i={i} px={x} py={y} />)}
    </div>
  );
}

/* ══════════ YARII — mongolingo 3D ертөнц: слайд бүрт өдөр → үдэш → шөнө ══════════ */
/** Сайтаас авсан 7 кадр. dark: true бол текст цайвар өнгөтэй болно. */
export const YARII_FRAMES = [
  { src: '/images/yarii-w1.jpg', dark: false }, // нар мандах
  { src: '/images/yarii-w2.jpg', dark: false }, // өдөр, гэр хороолол
  { src: '/images/yarii-w3.jpg', dark: false }, // ойроос
  { src: '/images/yarii-w4.jpg', dark: true },  // бүрэнхий, гэрэлтэх үсгүүд
  { src: '/images/yarii-w5.jpg', dark: true },  // шөнө, овоо
  { src: '/images/yarii-w6.jpg', dark: true },  // шөнө, гэрэлтэй гэрүүд
  { src: '/images/yarii-w7.jpg', dark: true },  // гүн шөнө
];

const WORDS: [string, string][] = [
  ['Сайн байна уу', 'Hello'], ['Баярлалаа', 'Thank you'], ['Тийм ээ', 'Yes'], ['Үгүй', 'No'],
  ['Уучлаарай', 'Sorry'], ['Ойлгохгүй байна', "I don't understand"], ['Дахиад хэлээч', 'Say it again'], ['Баяртай', 'Goodbye'],
];

export function YariiBackdrop({ step, dir }: { step: number; dir: number }) {
  const { x, y } = usePointer();
  const fx = useTransform(x, (v) => v * -30);
  const fy = useTransform(y, (v) => v * -20);
  const f = YARII_FRAMES[Math.min(step, YARII_FRAMES.length - 1)];
  const strip = [...WORDS, ...WORDS];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0F151C]">
      {/* Кадр солигдох: камер нисэж буй мэт */}
      <AnimatePresence initial={false}>
        <motion.div key={f.src} className="absolute -inset-[4%]" style={{ x: fx, y: fy }}
          initial={{ opacity: 0, scale: 1.25, x: dir * 80, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1.04, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}>
          <motion.img src={f.src} alt="" className="h-full w-full object-cover"
            animate={{ scale: [1, 1.07, 1] }} transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>
      </AnimatePresence>

      {/* Унших боломжтой болгох зөөлөн туяа */}
      <motion.div className="absolute inset-0" animate={{
        background: f.dark
          ? 'radial-gradient(70% 60% at 50% 45%, rgba(12,14,22,.55), rgba(12,14,22,.15) 75%)'
          : 'radial-gradient(70% 60% at 50% 45%, rgba(240,228,222,.72), rgba(240,228,222,.1) 75%)',
      }} transition={{ duration: 1.2 }} />

      {/* Том контур үгс */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none overflow-hidden">
        <div className="animate-marquee flex w-max gap-16 whitespace-nowrap font-display text-[9rem] font-extrabold leading-none text-transparent transition-all duration-1000 md:text-[12rem]"
          style={{ animationDuration: '60s', WebkitTextStroke: f.dark ? '1.5px rgba(246,236,224,0.14)' : '1.5px rgba(58,42,31,0.10)' }}>
          {[0, 1].map((k) => <span key={k}>{WORDS.map((w) => w[0]).join('  ')}  </span>)}
        </div>
      </div>

      {/* Налуу гүйдэг тууз */}
      <div className="absolute inset-x-[-2rem] bottom-16 -rotate-[1.4deg] overflow-hidden bg-[linear-gradient(120deg,#5E6B42_0%,#4E5F69_50%,#6B4426_100%)] py-3 shadow-[0_24px_40px_-28px_rgba(30,20,12,0.7)]">
        <div className="animate-marquee flex w-max whitespace-nowrap" style={{ animationDuration: '70s' }}>
          {strip.map(([mn, en], i) => (
            <span key={i} className="flex items-center gap-3 px-5 text-[#F6ECE0]">
              <b className="font-display text-xl font-bold md:text-2xl">{mn}</b>
              <span className="text-sm opacity-70">{en}</span>
              <span className="text-[#E8C9A0]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════ Ерөнхий ══════════ */
export function DarkBackdrop() {
  return <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(212,175,55,.12),transparent_70%)]" />;
}

/* ══════════ БАГ — сэтгүүлийн зураг, гишүүн бүр рүү камер ойртоно ══════════ */
export function TeamScene({ focus }: { focus: number }) {
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const f = () => setVp({ w: innerWidth, h: innerHeight });
    f(); addEventListener('resize', f); return () => removeEventListener('resize', f);
  }, []);
  const Hd = vp.h * 0.86, Wd = Hd * TEAM.ratio;
  const left = vp.w * 0.64 - Wd / 2, top = (vp.h - Hd) / 2;
  const m = focus >= 0 ? TEAM.members[focus] : null;
  /** Нүдний зай дэлгэцийн ~6.5% болтол томруулна, дэлгэцийн 30%-д байрлана */
  const s = m ? (vp.w * 0.065) / ((m.fw / 100) * Wd) : 1;
  const x = m ? vp.w * 0.3 - left - s * (m.focus[0] / 100) * Wd : 0;
  const y = m ? vp.h * 0.5 - top - s * (m.focus[1] / 100) * Hd : 0;
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0A0B10]">
      <img src={TEAM.photo} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl" />
      <motion.div className="absolute" style={{ left, top, width: Wd, height: Hd, transformOrigin: '0 0' }}
        initial={{ scale: 0.8, x: Wd * 0.1, y: Hd * 0.1, rotate: -6, opacity: 0 }}
        animate={{ scale: s, x, y, rotate: m ? 0 : -2.5, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 26, damping: 14, mass: 1.3 }}>
        <div className="h-full w-full bg-[#F4EFE3] p-[1.2%] shadow-[0_40px_80px_-20px_rgba(0,0,0,.8)]">
          <img src={TEAM.photo} alt="Team" className="h-full w-full select-none object-cover" draggable={false} />
        </div>
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0" animate={{ opacity: m ? 1 : 0 }} transition={{ duration: 0.9 }}
        style={{ background: 'radial-gradient(30% 50% at 30% 50%, transparent 45%, rgba(10,11,16,.5) 100%), linear-gradient(90deg, transparent 40%, rgba(10,11,16,.92) 62%)' }} />
    </div>
  );
}
