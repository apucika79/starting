// Ez a fájl a Starting belépési és regisztrációs előkészítő oldalait jeleníti meg közös elrendezéssel.
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { AuthKartya } from '@/komponensek/AuthKartya';
import {
  belepesEmailJelszoval,
  jelszoFrissitese,
  jelszoVisszaallitasKerese,
  recoveryAllapotAzUrlbol,
  torliAuthVisszateroParametereket,
} from '@/szolgaltatasok/auth';

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
    labjegyzet:
      'A következő fejlesztési szakaszban ide kerül a teljes meghíváskezelés és a részletes szerepkör alapú profilbetöltés további finomítása.',
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

const recoveryTartalom = {
  felirat: 'Jelszó-visszaállítás',
  cim: 'Adj meg új jelszót a Starting fiókodhoz.',
  leiras:
    'A visszaállító linkről érkező felhasználók itt biztonságosan új jelszót állíthatnak be, majd azonnal visszatérhetnek a belső felületre.',
  gombSzoveg: 'Új jelszó mentése',
  labjegyzet: 'A visszaállító munkamenet csak rövid ideig érvényes. Ha a link lejárt, kérj új emailt a belépési képernyőről.',
  alsoLinkSzoveg: 'Inkább visszalépnél?',
  alsoLinkHref: '/belepes',
  alsoLinkCimke: 'Belépés',
  mezok: [
    {
      azonosito: 'uj-jelszo',
      cimke: 'Új jelszó',
      tipus: 'password' as const,
      helyorzo: 'Legalább 8 karakter',
      automatikusKitoltes: 'new-password',
    },
    {
      azonosito: 'uj-jelszo-megerosites',
      cimke: 'Új jelszó újra',
      tipus: 'password' as const,
      helyorzo: 'Ismételd meg az új jelszót',
      automatikusKitoltes: 'new-password',
    },
  ],
  kiemeltPontok: [
    'Visszatérő recovery linkek kezelése ugyanazon az auth felületen.',
    'Jelszófrissítés közvetlenül a Supabase helyreállító munkamenetével.',
    'Magyar nyelvű visszajelzés lejárt vagy hibás link esetére is.',
    'Tiszta átmenet a belépés és a védett felület között.',
  ],
};

export function AuthOldal({ mod }: AuthOldalTulajdonsagok) {
  const [ertekek, setErtekek] = useState<Record<string, string>>({
    email: '',
    jelszo: '',
    'meghivo-email': '',
    'meghivo-token': '',
    'uj-jelszo': '',
    'uj-jelszo-megerosites': '',
  });
  const [betoltes, setBetoltes] = useState(false);
  const [hibaUzenet, setHibaUzenet] = useState('');
  const [sikerUzenet, setSikerUzenet] = useState('');
  const [jelszoResetMod, setJelszoResetMod] = useState(false);
  const [recoveryMod, setRecoveryMod] = useState(false);

  const tartalom = recoveryMod ? recoveryTartalom : authTartalom[mod];

  useEffect(() => {
    if (mod !== 'belepes') {
      return;
    }

    const recoveryAllapot = recoveryAllapotAzUrlbol();
    setRecoveryMod(recoveryAllapot.aktiv);

    if (recoveryAllapot.aktiv) {
      setJelszoResetMod(false);
      setHibaUzenet(recoveryAllapot.hibaUzenet);
      setSikerUzenet(
        recoveryAllapot.hibaUzenet ? '' : 'A visszaállító link érvényes. Add meg az új jelszavadat a belépés folytatásához.',
      );
      return;
    }

    if (recoveryAllapot.hibaUzenet) {
      setHibaUzenet(recoveryAllapot.hibaUzenet);
      setSikerUzenet('');
      torliAuthVisszateroParametereket();
    }
  }, [mod]);

  const aktualisMezok = useMemo(() => {
    if (recoveryMod) {
      return recoveryTartalom.mezok;
    }

    if (mod === 'belepes' && jelszoResetMod) {
      return [tartalom.mezok[0]];
    }

    return tartalom.mezok;
  }, [jelszoResetMod, mod, recoveryMod, tartalom.mezok]);

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

    if (recoveryMod) {
      const ujJelszo = ertekek['uj-jelszo'];
      const ujJelszoMegerositese = ertekek['uj-jelszo-megerosites'];

      if (ujJelszo.length < 8) {
        setHibaUzenet('Az új jelszónak legalább 8 karakter hosszúnak kell lennie.');
        return;
      }

      if (ujJelszo !== ujJelszoMegerositese) {
        setHibaUzenet('A két új jelszó nem egyezik meg.');
        return;
      }

      setBetoltes(true);

      try {
        const { error } = await jelszoFrissitese(ujJelszo);

        if (error) {
          setHibaUzenet(error.message);
          return;
        }

        torliAuthVisszateroParametereket();
        setSikerUzenet('Az új jelszó mentve. Néhány másodpercen belül megnyitjuk a belső felületet.');
        setRecoveryMod(false);
        window.setTimeout(() => {
          window.location.href = '/fiok';
        }, 1200);
        return;
      } finally {
        setBetoltes(false);
      }
    }

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

  const extraMuveletSzoveg =
    mod === 'belepes' && !recoveryMod ? (jelszoResetMod ? 'Mégis belépnél?' : 'Elfelejtetted a jelszavad?') : undefined;
  const extraMuveletCimke = mod === 'belepes' && !recoveryMod ? (jelszoResetMod ? 'Vissza a belépéshez' : 'Jelszó-visszaállítás') : undefined;

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
          gombSzoveg={mod === 'belepes' && jelszoResetMod && !recoveryMod ? 'Jelszó-visszaállító email küldése' : tartalom.gombSzoveg}
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
