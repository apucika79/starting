// Ez a fájl a Starting mobilalkalmazás környezeti beállításait egy központi objektumba gyűjti.
export const alkalmazasKonfiguracio = {
  domain: process.env.EXPO_PUBLIC_APP_DOMAIN || 'https://starting.hu',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
};
