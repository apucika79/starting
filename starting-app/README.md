<!-- Ez a fájl a Starting mobilprojekt rövid fejlesztői összefoglalója és indítási útmutatója. -->
# starting-app

Expo React Native + TypeScript alapú mobilalkalmazás a Starting rendszerhez.

## Környezeti változók

Másold a `starting-app/.env.example` fájlt `starting-app/.env` néven, majd töltsd ki a következő értékeket:

```env
EXPO_PUBLIC_SUPABASE_URL=https://pelda-projekt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=pelda-nyilvanos-kulcs
EXPO_PUBLIC_APP_DOMAIN=starting://belepes
```

Az Expo kliensoldali környezeti változókhoz az `EXPO_PUBLIC_` előtag kötelező. A `.env` fájl helyi fejlesztési konfiguráció, ezért nincs verziókezelésben.

## Parancsok

```bash
npm run start
npm run android
npm run ios
npm run web
npm run typecheck
```

## Első szakasz tartalma

- működő belépő kártya
- induló főképernyő áttekintés
- közös Supabase backendhez előkészített klienshely
- bővíthető magyar mappaszerkezet
