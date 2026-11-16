import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0B10',
        gold: { DEFAULT: '#D4AF37', light: '#F3E2A0', dark: '#9C7B1E' },
        royal: { DEFAULT: '#1E3A8A', light: '#3653B8' },
      },
      fontFamily: {
        display: ['var(--font-h)', 'Unbounded', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
