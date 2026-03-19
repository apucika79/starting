// Ez a fájl a Starting belépési és regisztrációs előkészítő oldalait jeleníti meg közös elrendezéssel.
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

import { AuthKartya } from '@/komponensek/AuthKartya';
import { belepesEmailJelszoval, jelszoVisszaallitasKerese } from '@/szolgaltatasok/auth';

export type AuthOldalMod = 'belepes' | 'regisztracio';

type AuthOldalTulajdonsagok = {
  mod: AuthOldalMod;
};

const authTartalom = {
  belepes: {
    felirat: 'Belépés',
    cim: 'Üdv újra a Starting rendszerben.',
    leiras:
      'A webes auth első működő verziója már valódi Supabase belépéssel dolgozik, és előkészíti a vállalati munkamenet-kezelést a következő iterációkhoz.',
    gombSzoveg: 'Belépés',
    labjegyzet: 'A következő fejlesztési szakaszban ide kerül a teljes jelszó-visszaállítási visszatérő folyamat, a meghíváskezelés és a részletes szerepkör alapú profilbetöltés.',
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
      'Valódi email + jelszó belépés Supabase Auth kapcsolattal.',
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
    gombSzoveg: 'Regisztráció hamarosan',
    labjegyzet: 'A meghívó token ellenőrzése, a jelszó beállítása és a szerepkörhöz tartozó profiladatok validálása a következő iterációban érkezik.',
    alsoLinkSzoveg: 'Már van hozzáférésed?',
    alsoLinkHref: '/belepes',
    alsoLinkCimke: 'Belépés',
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
  const [ertekek, setErtekek] = useState<Record<string, string>>({
    email: '',
    jelszo: '',
    'meghivo-email': '',
    'meghivo-token': '',
    'uj-jelszo': '',
  });
  const [betoltes, setBetoltes] = useState(false);
  const [hibaUzenet, setHibaUzenet] = useState('');
  const [sikerUzenet, setSikerUzenet] = useState('');
  const [jelszoResetMod, setJelszoResetMod] = useState(false);

  const tartalom = authTartalom[mod];

  const aktualisMezok = useMemo(() => {
    if (mod === 'belepes' && jelszoResetMod) {
      return [tartalom.mezok[0]];
    }

    return tartalom.mezok;
  }, [jelszoResetMod, mod, tartalom.mezok]);

  const kezeliMezoValtozast = (azonosito: string, ertek: string) => {
    setErtekek((elozo) => ({
      ...elozo,
      [azonosito]: ertek,
    }));
  };

  const visszaallitAllapotokat = () => {
    setHibaUzenet('');
    setSikerUzenet('');
  };

  const kezeliKuldes = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    visszaallitAllapotokat();

    if (mod === 'regisztracio') {
      setSikerUzenet('A meghívásos regisztráció backendje még előkészítés alatt van. A belépési folyamat viszont már beköthető és tesztelhető.');
      return;
    }

    const email = ertekek.email.trim();

    if (!email) {
      setHibaUzenet('Add meg a munkahelyi email címedet.');
      return;
    }

    setBetoltes(true);

    try {
      if (jelszoResetMod) {
        const { error } = await jelszoVisszaallitasKerese(email);

        if (error) {
          setHibaUzenet(error.message);
          return;
        }

        setSikerUzenet('Elküldtük a jelszó-visszaállítási emailt, ha létezik fiók ehhez a címhez.');
        return;
      }

      const jelszo = ertekek.jelszo;

      if (!jelszo) {
        setHibaUzenet('Add meg a jelszavadat.');
        return;
      }

      const { error } = await belepesEmailJelszoval(email, jelszo);

      if (error) {
        setHibaUzenet(error.message);
        return;
      }

      window.location.href = '/fiok';
    } finally {
      setBetoltes(false);
    }
  };

  const extraMuveletSzoveg = mod === 'belepes' ? (jelszoResetMod ? 'Mégis belépnél?' : 'Elfelejtetted a jelszavad?') : undefined;
  const extraMuveletCimke = mod === 'belepes' ? (jelszoResetMod ? 'Vissza a belépéshez' : 'Jelszó-visszaállítás') : undefined;

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

        <AuthKartya
          {...tartalom}
          mezok={aktualisMezok}
          ertekek={ertekek}
          betoltes={betoltes}
          hibaUzenet={hibaUzenet}
          sikerUzenet={sikerUzenet}
          gombSzoveg={mod === 'belepes' && jelszoResetMod ? 'Jelszó-visszaállító email küldése' : tartalom.gombSzoveg}
          extraMuveletSzoveg={extraMuveletSzoveg}
          extraMuveletCimke={extraMuveletCimke}
          onExtraMuvelet={() => {
            visszaallitAllapotokat();
            setJelszoResetMod((elozo) => !elozo);
          }}
          onMezoValtozas={kezeliMezoValtozast}
          onSubmit={kezeliKuldes}
        />
      </div>
    </main>
  );
}
