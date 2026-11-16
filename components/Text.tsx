'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/** Find My School загвар: үг бүр доороос эргэж гарч ирнэ */
export function WordIn({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span style={{ perspective: 800 }} className="inline">
      {text.split(' ').map((w, i) => (
        <motion.span key={i} className="inline-block" style={{ transformOrigin: '50% 100%' }}
          initial={{ opacity: 0, y: '0.45em', rotateX: -70 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}>
          {w}{' '}
        </motion.span>
      ))}
    </span>
  );
}

/** Yarii загвар: үсэг үсгээр бичигдэнэ + анивчих курсор (байрлал үсрэхгүй) */
export function Typewriter({ text, speed = 55, delay = 650 }: { text: string; speed?: number; delay?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    let id: ReturnType<typeof setInterval> | undefined;
    const t = setTimeout(() => {
      id = setInterval(() => setN((v) => { if (v >= text.length) { clearInterval(id); return v; } return v + 1; }), speed);
    }, delay);
    return () => { clearTimeout(t); if (id) clearInterval(id); };
  }, [text, speed, delay]);
  return (
    <span className="relative inline-block">
      <span className="invisible">{text}</span>
      <span className="absolute inset-0 whitespace-pre-wrap">
        {text.slice(0, n)}
        <span className="relative inline-block w-0">
          <span className="animate-caret absolute bottom-[-0.06em] left-[0.08em] h-[0.78em] w-[0.08em] rounded-full" style={{ background: 'var(--accent)' }} />
        </span>
      </span>
    </span>
  );
}

/** Тогтмол "санамсаргүй" тоо (SSR-д тохирно) */
const rnd = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

/** Yarii загвар: тэнгэрт хөвөх гэрэлтэй үсгүүд нийлж гарчиг болно */
export function GlowLetters({ text, delay = 0.15 }: { text: string; delay?: number }) {
  let k = 0;
  return (
    <span className="inline" style={{ color: 'var(--glowFg)', textShadow: 'var(--glow)' }}>
      {text.split(' ').map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(w).map((ch) => {
            const i = k++;
            return (
              <motion.span key={i} className="inline-block"
                initial={{ opacity: 0, x: (rnd(i) - 0.5) * 520, y: -120 - rnd(i + 7) * 260, rotate: (rnd(i + 3) - 0.5) * 90, scale: 0.6, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{ type: 'spring', stiffness: 70, damping: 13, delay: delay + i * 0.035 }}>
                <motion.span className="inline-block" animate={{ y: [0, -(3 + rnd(i + 11) * 5), 0] }}
                  transition={{ duration: 2.6 + rnd(i + 5) * 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 + rnd(i) }}>
                  {ch}
                </motion.span>
              </motion.span>
            );
          })}
          {' '}
        </span>
      ))}
    </span>
  );
}
