// Ez a fájl a Starting webalkalmazás Vite konfigurációját tartalmazza, és aliasokat állít be a tiszta importokhoz.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
