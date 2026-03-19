// Ez a fájl a Starting webes alkalmazás környezeti beállításait olvassa ki egységes helyről.
export const alkalmazasKonfiguracio = {
  domain: import.meta.env.VITE_APP_DOMAIN || 'https://starting.hu',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
};
