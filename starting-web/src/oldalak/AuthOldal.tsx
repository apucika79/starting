// Ez a fájl a Starting belépési és regisztrációs előkészítő oldalait jeleníti meg közös elrendezéssel.
import { AuthKartya } from '@/komponensek/AuthKartya';

export type AuthOldalMod = 'belepes' | 'regisztracio';

type AuthOldalTulajdonsagok = {
  mod: AuthOldalMod;
};

const authTartalom = {
  belepes: {
    felirat: 'Belépés',
    cim: 'Üdv újra a Starting rendszerben.',
    leiras:
      'Ez az auth-előkészítő képernyő a későbbi Supabase Auth belépési folyamat helye. Már most megmutatja, hogyan fog kinézni a vállalati belépési élmény weben.',
    gombSzoveg: 'Belépés folytatása',
    labjegyzet: 'A következő fejlesztési szakaszban ide kerül az email + jelszó hitelesítés, az elfelejtett jelszó folyamat és a munkamenet-kezelés.',
    alsoLinkSzoveg: 'Még nincs meghívásod?',
    alsoLinkHref: '/regisztracio',
    alsoLinkCimke: 'Regisztráció előkészítése',
    mezok: [
      {
        azonosito: 'email',
        cimke: 'Munkahelyi email cím',
        tipus: 'email' as const,
        helyorzo: 'nev@ceg.hu',
        automatikusKitoltes: 'email',
      },
      {
        azonosito: 'jelszo',
        cimke: 'Jelszó',
        tipus: 'password' as const,
        helyorzo: '••••••••',
        automatikusKitoltes: 'current-password',
      },
    ],
    kiemeltPontok: [
      'Szerepkör alapú belépési élmény adminoknak, vezetőknek és dolgozóknak.',
      'Egységes munkamenet a későbbi webes és mobilos felületek között.',
      'Előkészített hely az elfelejtett jelszó és a meghívás-elfogadás számára.',
      'Stabil, magyar nyelvű vállalati UI már az auth-réteghez is.',
    ],
  },
  regisztracio: {
    felirat: 'Meghívásos regisztráció',
    cim: 'Új felhasználó előkészítése a Startingban.',
    leiras:
      'A rendszer induló terve meghívásos regisztrációval számol. Ez a felület a későbbi tokenes beléptetés és profilaktiválás vizuális alapját adja meg.',
    gombSzoveg: 'Regisztráció folytatása',
    labjegyzet: 'A meghívó token ellenőrzése, a jelszó beállítása és a szerepkörhöz tartozó profiladatok validálása a következő iterációban érkezik.',
    alsoLinkSzoveg: 'Már van hozzáférésed?',
    alsoLinkHref: '/belepes',
    alsoLinkCimke: 'Belépés előkészítése',
    mezok: [
      {
        azonosito: 'meghivo-email',
        cimke: 'Meghívott email cím',
        tipus: 'email' as const,
        helyorzo: 'nev@ceg.hu',
        automatikusKitoltes: 'email',
      },
      {
        azonosito: 'meghivo-token',
        cimke: 'Meghívó kód',
        tipus: 'text' as const,
        helyorzo: 'START-2026-INVITE',
      },
      {
        azonosito: 'uj-jelszo',
        cimke: 'Új jelszó',
        tipus: 'password' as const,
        helyorzo: 'Legalább 8 karakter',
        automatikusKitoltes: 'new-password',
      },
    ],
    kiemeltPontok: [
      'Meghívás-alapú onboarding új dolgozók és külsős szereplők számára.',
      'Előkészített hely a vállalati egység, telephely és szerepkör azonosításához.',
      'Bővíthető struktúra kötelező elfogadásokhoz és első belépési lépésekhez.',
      'Azonos vizuális nyelv a landing oldal és a belső auth-folyamatok között.',
    ],
  },
};

export function AuthOldal({ mod }: AuthOldalTulajdonsagok) {
  const tartalom = authTartalom[mod];

  return (
    <main className="min-h-screen bg-halo px-6 py-6 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 shadow-kartya backdrop-blur sm:px-8 lg:px-10 lg:py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-6 text-sm text-slate-300">
          <a className="rounded-full px-4 py-2 transition hover:bg-white/10" href="/">
            Vissza a főoldalra
          </a>
          <div className="flex flex-wrap gap-3">
            <a className="rounded-full px-4 py-2 transition hover:bg-white/10" href="/belepes">
              Belépés
            </a>
            <a className="rounded-full px-4 py-2 transition hover:bg-white/10" href="/regisztracio">
              Regisztráció
            </a>
          </div>
        </div>

        <AuthKartya {...tartalom} />
      </div>
    </main>
  );
}
