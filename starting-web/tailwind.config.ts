// Ez a fájl a Starting webes dizájnrendszer alap Tailwind beállításait tartalmazza.
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        starting: {
          sotet: '#0f172a',
          primer: '#0f766e',
          primerVilagos: '#0d9488',
          hamvas: '#64748b',
          kiemelt: '#e2e8f0',
          felulet: '#f8fafc',
          keret: '#cbd5e1',
        },
      },
      boxShadow: {
        kartya: '0 25px 60px rgba(15, 23, 42, 0.18)',
      },
      backgroundImage: {
        halo:
          'radial-gradient(circle at top left, rgba(15,118,110,0.10), transparent 34%), radial-gradient(circle at top right, rgba(148,163,184,0.18), transparent 30%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
