// Ez a fájl a Starting webes dizájnrendszer alap Tailwind beállításait tartalmazza.
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        starting: {
          sotet: '#020617',
          primer: '#0f766e',
          primerVilagos: '#14b8a6',
          hamvas: '#cbd5e1',
          kiemelt: '#38bdf8',
        },
      },
      boxShadow: {
        kartya: '0 25px 60px rgba(15, 23, 42, 0.18)',
      },
      backgroundImage: {
        halo:
          'radial-gradient(circle at top left, rgba(20,184,166,0.18), transparent 32%), radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 28%), linear-gradient(180deg, #020617 0%, #0f172a 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
