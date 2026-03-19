<!-- Ez a fájl a Starting projekthez szükséges környezeti változókat sorolja fel példákkal. -->
# Környezeti változók

## 1. Kötelező kliens oldali változók

A projekt Supabase klienskapcsolatához az alábbi négy változó mindenképpen szükséges. A webes és a mobilalkalmazás külön prefixet használ, ezért ugyanazt a projektet platformonként külön kell megadni.

### Web (`starting-web/.env`)

- `VITE_SUPABASE_URL=https://pelda-projekt.supabase.co` – a webes kliens által használt Supabase projekt URL-je.
- `VITE_SUPABASE_ANON_KEY=pelda-nyilvanos-kulcs` – a webes kliens publikus anon kulcsa.
- `VITE_APP_DOMAIN=http://localhost:5173`

### Mobil (`starting-app/.env`)

- `EXPO_PUBLIC_SUPABASE_URL=https://pelda-projekt.supabase.co` – a mobil kliens által használt Supabase projekt URL-je.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY=pelda-nyilvanos-kulcs` – a mobil kliens publikus anon kulcsa.
- `EXPO_PUBLIC_APP_DOMAIN=starting://belepes`

### Gyors minta helyi fejlesztéshez

```env
# starting-web/.env
VITE_SUPABASE_URL=https://pelda-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=pelda-publishable-kulcs
VITE_APP_DOMAIN=http://localhost:5173

# starting-app/.env
EXPO_PUBLIC_SUPABASE_URL=https://pelda-projekt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=pelda-publishable-kulcs
EXPO_PUBLIC_APP_DOMAIN=starting://belepes
```

## 2. Javasolt szerver / Edge Function változók

Ezeket **ne** tedd kliens oldali `.env` fájlba.

- `SUPABASE_SERVICE_ROLE_KEY` – meghívó kezeléshez, admin műveletekhez, storage aláírt URL-ekhez.
- `SUPABASE_DB_URL` – migrációkhoz vagy külső workerhez.
- `APP_BASE_URL=https://app.starting.hu` – email linkek generálásához.
- `APP_STAGING_URL=https://staging.starting.hu` – staging linkekhez.
- `EXPO_DEEP_LINK_SCHEME=starting` – mobil deep link előállításhoz.
- `INVITE_REDIRECT_PATH=/belepes` – meghívó linkhez.
- `PASSWORD_RESET_REDIRECT_PATH=/belepes` – password recovery redirecthez.
- `MAILER_FROM=noreply@starting.hu` – meghívó és auth emailek feladójához.
- `MAILER_PROVIDER_API_KEY=...` – tranzakciós email szolgáltató kulcs.
- `SENTRY_DSN=...` – hibafigyeléshez.
- `PUSH_PROVIDER_TOKEN=...` – későbbi push értesítésekhez.

## 3. Környezetenkénti minimum lista

### Local fejlesztés

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_DOMAIN`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_APP_DOMAIN`
- `SUPABASE_SERVICE_ROLE_KEY` *(ha használsz seedelő vagy invite küldő scriptet)*

### Staging

- minden kliens oldali változó staging értékkel,
- `SUPABASE_SERVICE_ROLE_KEY`,
- `APP_STAGING_URL`,
- `MAILER_PROVIDER_API_KEY`,
- `SENTRY_DSN`.

### Production

- minden kliens oldali változó production értékkel,
- `SUPABASE_SERVICE_ROLE_KEY`,
- `APP_BASE_URL`,
- `MAILER_PROVIDER_API_KEY`,
- `SENTRY_DSN`,
- `PUSH_PROVIDER_TOKEN` *(ha a push indul)*.

## 4. Biztonsági szabályok

- Az **anon key** nyilvános kliens kulcs, de csak RLS mellett biztonságos.
- A **service role key** kizárólag szerveroldalon használható.
- A `.env` fájlok ne kerüljenek gitbe, csak `.env.example` minták.
- A redirect URL-eket a Supabase projektben is whitelistelni kell.

## 5. Javasolt `.env.example` bővítések

### Web

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_DOMAIN=
```

### Mobil

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_APP_DOMAIN=
```

### Szerver / functions

```env
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_URL=
APP_BASE_URL=
APP_STAGING_URL=
EXPO_DEEP_LINK_SCHEME=
INVITE_REDIRECT_PATH=
PASSWORD_RESET_REDIRECT_PATH=
MAILER_FROM=
MAILER_PROVIDER_API_KEY=
SENTRY_DSN=
PUSH_PROVIDER_TOKEN=
```
