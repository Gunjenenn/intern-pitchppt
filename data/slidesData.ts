/**
 * ============================================================
 *  slidesData.ts — БҮХ АГУУЛГАА ЭНД ЗАСНА
 * ============================================================
 *  • theme: 'dark' | 'fms' | 'yarii'  → слайдын загвар (өнгө, фонт, анимаци)
 *  • img:   '/images/x.jpg' (public/images/ дотор) эсвэл https://... линк
 *  • Шинэ слайд: массив руу объект нэмэхэд л болно.
 */
import {
  Baby, BookOpen, GraduationCap, MessageCircleWarning, DatabaseZap, Hourglass,
  Layers, Target, ShieldCheck, Gem, Sparkles, BrainCircuit, Globe,
  type LucideIcon,
} from 'lucide-react';

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const LINKS = {
  findMySchool: 'https://find-my-school-rho.vercel.app',
  yariiMongola: 'https://mongolingo-vedg.vercel.app',
};

/** Сайтуудын бодит screenshot-ууд (public/images/) */
export const IMG = {
  fms: '/images/fms-home.jpg',
  yarii: '/images/yarii-home.jpg',
  yariiWorld: '/images/yarii-world.jpg', // Yarii слайдуудын дэвсгэр
};

/** ✏️ БАГ — нэр, үүргээ энд солино. focus = зураг дээрх нүүрний төв [x%, y%], fw = нүдний хоорондох зай (% зургийн өргөнөөс) */
export const TEAM = {
  photo: '/images/team-photo-retouched.jpg',
  ratio: 1087 / 1447,
  members: [
    { name: 'Лхагвадоржийн Гүнжид', role: 'Team Lead', focus: [48.1, 53.9], fw: 9.61, lead: true },
    { name: 'Баянжаргалын Анар', role: 'Main Developer', focus: [28.8, 26.4], fw: 2.57 },
    { name: 'Баянмөнхийн Тэмүүлэн', role: 'Main Developer', focus: [72.0, 26.9], fw: 2.91 },
    { name: 'Чинбатболдын Мөнхжин', role: 'Marketing Lead', focus: [12.1, 46.1], fw: 3.4 },
    { name: 'Лувсандоржийн Энхболд', role: 'Info Assistant', focus: [88.1, 45.7], fw: 3.73 },
  ],
};

/** ✏️ 1 сарын үнэ */
export const PRICE = 9_100;

export const STATS = [
  {
    value: '819,907',
    label: 'Монгол Улсын ЕБС-ийн нийт сурагч',
    source: 'Боловсролын яам · 2025–2026',
    sourceUrl: 'https://moe.gov.mn/post/170077',
  },
  {
    value: '75,890',
    label: '1-р ангид шинээр элссэн хүүхэд',
    source: 'Боловсролын яам · 2025–2026 · А-БДБ-7',
    sourceUrl: 'https://moe.gov.mn/post/170077',
  },
  {
    value: '≈12,000',
    label: 'Сургууль сольдог',
    source: 'ҮСХ · 2024 оны 6–17 насныхны дотоод нүүдлээр баримжаалав',
    sourceUrl: 'https://downloads.1212.mn/uKSipa0_ks2fQjoFj5-nCPO1hG-h8t-1Z57t9_-D.pdf',
  },
];

export type Theme = 'dark' | 'fms' | 'yarii' | 'team';
export type Cam = { pos: [number, number, number]; look?: [number, number, number] };
export type Card = { icon: LucideIcon; title: string; tag?: string; bad?: boolean };
type Base = { id: string; theme: Theme; cam: Cam };

export type Slide =
  | (Base & { type: 'cover'; kicker: string; title: [string, string]; subtitle: string; cta: string; imgs: [string, string] })
  | (Base & { type: 'team'; title: string; members: { name: string; role: string; img: string }[] })
  | (Base & { type: 'teamGroup'; eyebrow: string; title: string; subtitle: string })
  | (Base & { type: 'member'; idx: number })
  | (Base & { type: 'split'; title: string; projects: { name: string; tag: string; img: string }[] })
  | (Base & { type: 'title'; title: [string, string] })
  | (Base & { type: 'hero'; eyebrow: string; title: string; subtitle: string; img?: string })
  | (Base & { type: 'stats'; title: string })
  | (Base & {
      type: 'arrivals'; title: string; year: number; sourceUrl: string;
      purposes: { label: string; value: number }[];
    })
  | (Base & { type: 'cards'; eyebrow: string; title: string; variant: 'default' | 'problem' | 'solution'; cards: Card[] })
  | (Base & { type: 'question'; eyebrow: string; title: string })
  | (Base & { type: 'demo'; eyebrow: string; title: string; subtitle: string; url: string; cta: string; showQr?: boolean; restart?: boolean })
  | (Base & {
      type: 'pricing'; eyebrow: string; title: string;
      ai: { title: string; from: string; to: string };
      plan: { price: number; features: string[]; cta: string; url: string };
      paidUsers: number;
    });

export const slides: Slide[] = [
  { id: 'cover', type: 'cover', theme: 'dark', cam: { pos: [0, 0, 12] },
    kicker: '8 долоо хоногийн sprint', title: ['8 Долоо Хоног', '2 Шийдэл'],
    subtitle: 'Find My School × Yarii Mongola', cta: 'Эхлэх',
    imgs: [IMG.fms, IMG.yarii] },

  { id: 'team', type: 'teamGroup', theme: 'team', cam: { pos: [0, 0, 10] },
    eyebrow: 'Our Team', title: 'Манай Баг', subtitle: '5 хүн · 8 долоо хоног · 2 төсөл' },
  ...[0, 1, 2, 3, 4].map((idx): Slide => ({ id: `member-${idx + 1}`, type: 'member', idx, theme: 'team', cam: { pos: [0, 0, 10] } })),

  { id: 'overview', type: 'split', theme: 'dark', cam: { pos: [4, -1, 10] },
    title: '8 Долоо Хоног · 2 Бодит Төсөл',
    projects: [
      { name: 'Find My School', tag: 'Сургууль хайх', img: IMG.fms },
      { name: 'Yarii Mongola', tag: 'Хэл + Соёл + AI', img: IMG.yarii },
    ] },

  { id: 'fms-hero', type: 'title', theme: 'fms', cam: { pos: [6, 2, 9] },
    title: ['Find My', 'School'] },

  { id: 'fms-stats', type: 'stats', theme: 'fms', cam: { pos: [2, 5, 10] },
    title: 'ЕБС-ийн сурагчид' },

  { id: 'fms-q', type: 'question', theme: 'fms', cam: { pos: [0, 0, 5] },
    eyebrow: 'Find My School', title: 'Асуудал ?' },

  { id: 'fms-pain', type: 'cards', variant: 'problem', theme: 'fms', cam: { pos: [-3, -3, 9] },
    eyebrow: 'Бэрхшээл', title: 'Сургууль сонгоход хэцүү',
    cards: [
      { icon: MessageCircleWarning, title: 'Ам дамжсан яриа', tag: 'Баталгаагүй' },
      { icon: DatabaseZap, title: 'Мэдээлэл дутмаг', tag: 'Нэгдсэн сан алга' },
      { icon: Hourglass, title: 'Цаг алддаг', tag: 'Тархай эх сурвалж' },
    ] },

  { id: 'fms-audience', type: 'cards', variant: 'default', theme: 'fms', cam: { pos: [-6, 1, 9] },
    eyebrow: 'Хэнд?', title: 'Зорилтот Хэрэглэгчид',
    cards: [
      { icon: Baby, title: 'Бага анги', tag: '+ эцэг эх' },
      { icon: BookOpen, title: 'Дунд анги', tag: '6–9 анги' },
      { icon: GraduationCap, title: 'Ахлах анги', tag: '10–12 анги' },
    ] },

  { id: 'fms-solution', type: 'cards', variant: 'solution', theme: 'fms', cam: { pos: [5, 3, 8] },
    eyebrow: 'Шийдэл', title: 'Find My School',
    cards: [
      { icon: Layers, title: 'Нэг дор', tag: 'Төлбөр · хөтөлбөр · байршил' },
      { icon: Target, title: 'Танд тохирсон', tag: 'Хувийн санал' },
      { icon: ShieldCheck, title: 'Бодит үнэлгээ', tag: 'Баталгаатай' },
    ] },

  { id: 'fms-demo', type: 'demo', theme: 'fms', cam: { pos: [0, 1, 10] },
    eyebrow: 'Live Demo', title: 'Find My School', subtitle: 'Одоо туршаад үз',
    url: LINKS.findMySchool, cta: 'Live Demo Үзэх' },

  { id: 'ym-hero', type: 'hero', theme: 'yarii', cam: { pos: [-6, 2, 8] },
    eyebrow: 'Төсөл 02', title: 'Yarii Mongola',
    subtitle: 'Монгол хэл + өв соёл + AI' },

  { id: 'ym-arrivals', type: 'arrivals', theme: 'dark', cam: { pos: [0, 0, 10] },
    title: 'Монголд ирсэн гадаадын зорчигчид', year: 2025,
    sourceUrl: 'https://data.1212.mn/pxweb/mn/NSO/NSO__Industry,%20service__Tourism/DT_NSO_1800_005V2.px/',
    purposes: [
      { label: 'Аялал жуулчлал', value: 847170 },
      { label: 'Ажиллах', value: 72809 },
      { label: 'Суралцах', value: 10837 },
      { label: 'Бусад', value: 20392 },
    ] },

  { id: 'ym-q', type: 'question', theme: 'yarii', cam: { pos: [0.5, -0.5, 5] },
    eyebrow: 'Хэл & Соёл', title: 'Асуудал ?' },

  { id: 'ym-pain', type: 'cards', variant: 'problem', theme: 'yarii', cam: { pos: [3, -3, 9] },
    eyebrow: 'Бэрхшээл', title: 'Юу дутагдаж байна вэ?',
    cards: [
      { icon: Gem, bad: true, title: 'Чанар', tag: 'Чанартай хэрэгсэл алга' },
      { icon: Globe, bad: true, title: 'Монгол уламжлал', tag: 'Соёл орхигдсон' },
    ] },

  { id: 'ym-solution', type: 'cards', variant: 'solution', theme: 'yarii', cam: { pos: [-4, 3, 9] },
    eyebrow: 'Шийдэл', title: 'Yarii Mongola',
    cards: [
      { icon: Sparkles, title: 'Сонирхолтой & Уламжлалт', tag: 'Тоглоом + соёл' },
      { icon: BrainCircuit, title: 'Хиймэл оюун (AI)', tag: 'Ухаалаг багш' },
    ] },

  { id: 'ym-audience', type: 'hero', theme: 'yarii', cam: { pos: [6, 0, 10] },
    eyebrow: 'Хэнд зориулсан бэ?', title: 'Монгол хэл сурах хүсэлтэй гадаад хүмүүст',
    subtitle: 'Өдөр тутмын яриагаа давтаж, монгол соёлыг хэлээр нь танина.', img: '/images/yarii-learner-conversation.jpg' },

  { id: 'ym-pricing', type: 'pricing', theme: 'yarii', cam: { pos: [0, -5, 10] },
    eyebrow: 'AI & Үнэ', title: 'AI Орчуулга & Үнэ',
    ai: { title: 'Соёлыг ойлгодог AI орчуулга', from: 'Мал сүрэг тарган тавтай юу?', to: 'Are your herds healthy and well?' },
    plan: { price: PRICE, features: ['Хязгааргүй AI', 'Бүх хичээл', 'Тоглоом & streak'], cta: 'Эхлэх', url: LINKS.yariiMongola },
    paidUsers: 19 },

  { id: 'thanks', type: 'demo', restart: true, showQr: true, theme: 'yarii', cam: { pos: [0, 0, 14] },
    eyebrow: 'Баярлалаа', title: 'Анхаарал хандуулсанд баярлалаа!', subtitle: 'Yarii Mongola-г туршаад үз',
    url: LINKS.yariiMongola, cta: 'Yarii Mongola Live Demo' },
];
