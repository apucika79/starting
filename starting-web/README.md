<!-- Ez a fájl a Starting webes projekt rövid fejlesztői összefoglalója és indítási útmutatója. -->
# starting-web

React + TypeScript + Vite alapú webes felület a Starting rendszerhez.

## Környezeti változók

Másold a `starting-web/.env.example` fájlt `starting-web/.env` néven, majd töltsd ki a következő értékeket:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_APP_DOMAIN=http://localhost:5173
```

A `.env` fájl helyi fejlesztési konfiguráció, ezért nincs verziókezelésben.

## Parancsok

```bash
npm run dev
npm run build
npm run typecheck
```

## Első szakasz tartalma

- reszponzív, magyar nyelvű landing oldal
- Tailwind alapú vizuális alapok
- induló Supabase klienshely
- moduláris `src` mappaszerkezet
