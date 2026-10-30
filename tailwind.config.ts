import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-manrope)', 'var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.12)',
        lift: '0 2px 4px rgba(15,23,42,0.05), 0 20px 40px -20px rgba(15,23,42,0.25)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'slide-in': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        pulse2: { '0%,100%': { opacity: '0.35' }, '50%': { opacity: '1' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'slide-in': 'slide-in 0.3s cubic-bezier(0.32,0.72,0,1)',
        'fade-in': 'fade-in 0.2s ease-out',
        pulse2: 'pulse2 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
