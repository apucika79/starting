<!-- Ez a fájl a Starting induló hitelesítési folyamatának tervét foglalja össze Supabase Auth használathoz. -->
# Auth flow terv

## Célállapot

A Starting webes és mobilos kliense ugyanarra a Supabase Auth projektre csatlakozik, és közös meghívásos onboardingot használ:

1. az admin meghívót küld,
2. a felhasználó tokenes linken regisztrál,
3. az `auth.users` létrejötte után SQL trigger hozza létre a publikus profilt,
4. belépés után szerepkör és szervezeti egység alapján töltődnek a védett nézetek,
5. jelszó-visszaállítás és későbbi magic link / SSO ugyanebbe az auth rétegbe illeszthető.

## Javasolt első körös auth elemek

- **Email + jelszó belépés** a webes és mobil klienshez.
- **Meghívásos regisztráció** szerepkörrel, cég / telephely / terület előkiosztással.
- **Elfelejtett jelszó folyamat** dedikált redirect URL-lel.
- **Session perzisztencia** böngészőben és mobilon.
- **RLS-alapú profilbetöltés** a munkamenet indítása után.
- **Audit naplózás** fontos auth eseményekhez (`rendszer_naplok`).

## Részletes folyamatok

### 1. Meghívás küldése admin oldalról

1. A `ceg_admin` vagy `terulet_vezeto` létrehoz egy rekordot a `public.meghivok` táblában.
2. A rekord tartalmazza:
   - email,
   - szerepkör,
   - cég / telephely / terület hozzárendelés,
   - opcionális név, telefon, pozíció,
   - lejárati idő,
   - egyszer használható token.
3. Edge Function vagy backend worker e-mailt küld a meghívó linkkel.
4. A link például:
   - web: `https://app.starting.hu/belepes?token=...&email=...`
   - mobil deep link: `starting://belepes?token=...&email=...`

### 2. Meghívás ellenőrzése a kliensen

1. A kliens elolvassa az URL paramétereket.
2. Meghívja az `ervenyes_meghivo_ellenorzese` RPC-t.
3. A regisztrációs űrlapot csak akkor mutatja, ha:
   - a token létezik,
   - az email egyezik,
   - a meghívó még nem lett elfogadva,
   - a meghívó nem járt le.

### 3. Regisztráció

1. A kliens `supabase.auth.signUp()` hívást indít.
2. A `user_metadata` legalább az alábbi mezőket tartalmazza:
   - `teljes_nev`,
   - `meghivo_token`,
   - `szerepkor`,
   - `ceg_id`.
3. A `public.profil_letrehozasa_meghivobol()` trigger:
   - létrehozza vagy frissíti a `profilok` rekordot,
   - létrehozza vagy frissíti a `dolgozok` rekordot,
   - elfogadottra állítja a meghívót.

### 4. Belépés

1. A kliens `signInWithPassword()` hívást indít.
2. Sikeres belépés után:
   - session mentése,
   - `profilok` rekord lekérése,
   - szerepkör és szervezeti egység meghatározása,
   - átirányítás a megfelelő védett felületre.
3. A profilbetöltés hibája esetén:
   - kiléptetés vagy hibaállapot,
   - admin értesítés naplózása.

### 5. Jelszó-visszaállítás

1. A felhasználó megadja az email címét.
2. A kliens `resetPasswordForEmail()` hívást indít.
3. A redirect URL visszahozza a felhasználót a webes auth oldalra.
4. A kliens ellenőrzi a Supabase által visszaadott recovery állapotot.
5. A felhasználó új jelszót ad meg, majd `updateUser()` fut.

## Szerepkörök és hozzáférési modell

- **szuperadmin**: minden cég és adat kezelése.
- **ceg_admin**: saját cég összes telephelye, területe, dolgozója.
- **terulet_vezeto**: saját területhez tartozó operatív adatok.
- **dolgozo**: saját profil, jelenlét, saját elfogadások és célzott értesítések.

A szerepkör forrása a `public.profilok.szerepkor`, a tényleges adatelérés pedig RLS policy-kkel védett.

## Supabase oldali beállítási javaslat

### Auth provider-ek

Első körben:
- Email provider bekapcsolva.
- Email confirmation opcionális:
  - **B2B meghívásos modellnél** általában kikapcsolható, ha a meghívott email megbízható csatornán érkezik.
  - **Nyitott regisztráció esetén** érdemes bekapcsolni.

Későbbi bővítéshez:
- Microsoft Azure AD / Google SSO nagyvállalati ügyfelekhez.
- Magic link csak admin jóváhagyással.

### Redirect URL-ek

Javasolt külön kezelni környezetenként:
- local web: `http://localhost:5173/belepes`
- staging web: `https://staging.starting.hu/belepes`
- production web: `https://app.starting.hu/belepes`
- expo dev link: `exp://...`
- app scheme: `starting://belepes`

### JWT / session megfontolások

- Rövidebb access token lejárat, hosszabb refresh token használat.
- Mobilon biztonságos storage használata.
- Weben a Supabase kliens beépített session kezelése megfelelő indulásnak.

## Edge Function / backend feladatok

A tiszta auth UX-hez érdemes külön szerveroldali műveleteket bevezetni:

- `send-invite` – meghívó e-mail kiküldése.
- `resend-invite` – meghívó újraküldése új lejárattal.
- `revoke-invite` – státusz visszavonva.
- `post-login-audit` – opcionális audit napló frissítése.
- `sync-user-last-login` – `profilok.utolso_belepes_at` frissítése.

## Hibakezelési terv

- **Lejárt token** → új meghívó kérésének felajánlása.
- **Már elfogadott meghívó** → belépési képernyőre irányítás.
- **Hiányzó profil rekord** → admin támogatási hibaállapot.
- **RLS miatt sikertelen profilbetöltés** → session törlése és audit napló.
- **Többszörös regisztrációs kísérlet** → email alapú egyedi ellenőrzés.

## MVP utáni bővítések

- minden kliensről kijelentkeztetés,
- MFA admin és szuperadmin szerepkörökhöz,
- SSO támogatás ügyfélcégenként,
- eszközlista és aktív session nézet,
- audit dashboard auth eseményekhez.
