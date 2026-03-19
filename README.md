# Starting

A Starting egy modern, magyar nyelvű digitális munkakezdési, jelenléti, beléptetési, oktatási, eseménykezelési és adminisztrációs rendszer monorepo alapja.

## Mappák

- `starting-web` – React + TypeScript + Vite alapú webes felület.
- `starting-app` – Expo React Native + TypeScript alapú mobilalkalmazás.
- `docs` – projekt- és üzemeltetési dokumentáció.

## Gyors indulás

```bash
npm install
npm run indit:web
npm run indit:app
```

## Környezeti változók

Másold az alábbi mintafájlokat a saját `.env` fájljaidhoz:

- `starting-web/.env.example`
- `starting-app/.env.example`

## Fő technológiai alapok

- Web: React, TypeScript, Vite, Tailwind CSS
- Mobil: Expo, React Native, TypeScript
- Backend: Supabase
- Auth: Supabase Auth
