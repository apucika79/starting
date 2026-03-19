// Ez a fájl a Starting belépési és regisztrációs előkészítő oldalait jeleníti meg közös elrendezéssel.
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { AuthKartya } from '@/komponensek/AuthKartya';
import { NavigaciosLink } from '@/komponensek/NavigaciosLink';
import {
  authParameterekAzUrlbol,
  belepesEmailJelszoval,
  jelszoFrissitese,
  jelszoVisszaallitasKerese,
  meghivasosRegisztracio,
  recoveryAllapotAzUrlbol,
  torliAuthVisszateroParametereket,
} from '@/szolgaltatasok/auth';
import { meghivoEllenorzese } from '@/szolgaltatasok/meghivok';
import { navigalj } from '@/segedek/navigacio';
import type { MeghivoAdat } from '@/tipusok/meghivo';
import type { FelhasznaloiSzerepkor } from '@/tipusok/profil';

export type AuthOldalMod = 'belepes' | 'regisztracio';

type AuthOldalTulajdonsagok = {
  mod: AuthOldalMod;
  kezdoJelszoResetMod?: boolean;
};

const szerepkorCimkek: Record<FelhasznaloiSzerepkor, string> = {
  szuperadmin: 'Szuperadmin',
  ceg_admin: 'Cégadmin',
  terulet_vezeto: 'Területvezető',
  dolgozo: 'Dolgozó',
};

const authTartalom = {
  belepes: {
    felirat: 'Belépés',
    cim: 'Üdv újra a Starting rendszerben.',
    leiras:
      'A webes auth most már valós email + jelszó belépést, elfelejtett jelszó folyamatot és védett belső oldalt kezel a Supabase Auth munkameneteivel.',
    gombSzoveg: 'Belépés',
    labjegyzet: 'A munkamenet perzisztens, tokenfrissítéssel együtt kezelt, és a védett útvonalak automatikusan visszairányítanak belépésre.',
    alsoLinkSzoveg: 'Még nincs meghívásod?',
    alsoLinkHref: '/regisztracio',
    alsoLinkCimke: 'Meghívásos regisztráció',
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
      'Biztonságos, perzisztens session-kezelés automatikus tokenfrissítéssel.',
      'Elfelejtett jelszó kérés és recovery-linkes jelszócsere ugyanazon a felületen.',
      'Védett oldalak automatikus belépési kapuval.',
    ],
  },
  regisztracio: {
    felirat: 'Meghívásos regisztráció',
    cim: 'Új felhasználó aktiválása meghívó alapján.',
    leiras:
      'A regisztráció csak érvényes meghívóval érhető el. A szerepkör és a cégkapcsolat a meghívó alapján töltődik be, így a felhasználó csak a neki szánt jogosultsággal léphet be.',
    gombSzoveg: 'Regisztráció meghívóval',
    labjegyzet:
      'A meghívó token ellenőrzése és a szerepkörhöz kötött onboarding már bekötött része a folyamatnak. A profil létrehozását a Supabase trigger végzi a regisztráció után.',
    alsoLinkSzoveg: 'Már van hozzáférésed?',
    alsoLinkHref: '/belepes',
    alsoLinkCimke: 'Belépés',
    mezok: [
      {
        azonosito: 'teljes-nev',
        cimke: 'Teljes név',
        tipus: 'text' as const,
        helyorzo: 'Minta Márton',
        automatikusKitoltes: 'name',
      },
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
      {
        azonosito: 'uj-jelszo-megerosites',
        cimke: 'Új jelszó újra',
        tipus: 'password' as const,
        helyorzo: 'Ismételd meg az új jelszót',
        automatikusKitoltes: 'new-password',
      },
    ],
    kiemeltPontok: [
      'Meghívó token alapján ellenőrzött regisztráció.',
      'Szerepkörhöz kötött onboarding a meghívó rekordból.',
      'Automatikus profil-létrehozás és meghívó elfogadás a backend oldalon.',
      'Azonos magyar nyelvű auth élmény a belépéshez és az első aktiváláshoz.',
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

export function AuthOldal({ mod, kezdoJelszoResetMod = false }: AuthOldalTulajdonsagok) {
  const [ertekek, setErtekek] = useState<Record<string, string>>({
    email: '',
    jelszo: '',
    'teljes-nev': '',
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
  const [meghivo, setMeghivo] = useState<MeghivoAdat | null>(null);

  const tartalom = recoveryMod ? recoveryTartalom : authTartalom[mod];

  useEffect(() => {
    const { email, meghivoToken } = authParameterekAzUrlbol();

    if (mod === 'regisztracio') {
      setErtekek((elozo) => ({
        ...elozo,
        'meghivo-email': email || elozo['meghivo-email'],
        'meghivo-token': meghivoToken || elozo['meghivo-token'],
      }));
    }

    if (mod !== 'belepes') {
      return;
    }

    const recoveryAllapot = recoveryAllapotAzUrlbol();
    setRecoveryMod(recoveryAllapot.aktiv);
    setJelszoResetMod(kezdoJelszoResetMod && !recoveryAllapot.aktiv);

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
  }, [kezdoJelszoResetMod, mod]);

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

    if (azonosito === 'meghivo-email' || azonosito === 'meghivo-token') {
      setMeghivo(null);
    }
  };

  const visszaallitAllapotokat = () => {
    setHibaUzenet('');
    setSikerUzenet('');
  };

  const ellenorizdMeghivot = async (email: string, token: string) => {
    const { data, error } = await meghivoEllenorzese(token, email);

    if (error) {
      setMeghivo(null);
      setHibaUzenet(error.message);
      return null;
    }

    if (!data) {
      setMeghivo(null);
      setHibaUzenet('A meghívó nem található, már fel lett használva vagy lejárt. Kérj új meghívást az adminisztrátortól.');
      return null;
    }

    setMeghivo(data);
    return data;
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
          navigalj('/vezerlopult', { replace: true });
        }, 1200);
        return;
      } finally {
        setBetoltes(false);
      }
    }

    if (mod === 'regisztracio') {
      const teljesNev = ertekek['teljes-nev'].trim();
      const email = ertekek['meghivo-email'].trim().toLowerCase();
      const token = ertekek['meghivo-token'].trim();
      const ujJelszo = ertekek['uj-jelszo'];
      const ujJelszoMegerosites = ertekek['uj-jelszo-megerosites'];

      if (!teljesNev) {
        setHibaUzenet('Add meg a teljes nevedet.');
        return;
      }

      if (!email) {
        setHibaUzenet('Add meg a meghívott email címet.');
        return;
      }

      if (!token) {
        setHibaUzenet('Add meg a meghívó kódot.');
        return;
      }

      if (ujJelszo.length < 8) {
        setHibaUzenet('Az új jelszónak legalább 8 karakter hosszúnak kell lennie.');
        return;
      }

      if (ujJelszo !== ujJelszoMegerosites) {
        setHibaUzenet('A két új jelszó nem egyezik meg.');
        return;
      }

      setBetoltes(true);

      try {
        const ervenyesMeghivo = meghivo?.email === email && meghivo.id ? meghivo : await ellenorizdMeghivot(email, token);

        if (!ervenyesMeghivo) {
          return;
        }

        const { data, error } = await meghivasosRegisztracio({
          email,
          jelszo: ujJelszo,
          teljesNev,
          meghivoToken: token,
          meghivo: ervenyesMeghivo,
        });

        if (error) {
          setHibaUzenet(error.message);
          return;
        }

        if (data.session) {
          setSikerUzenet('A regisztráció sikeres, a meghívó aktiválva lett. Betöltjük a védett fiókoldalt.');
          window.setTimeout(() => {
            navigalj('/vezerlopult', { replace: true });
          }, 1000);
          return;
        }

        setSikerUzenet('A regisztráció sikeres. Megerősítő emailt küldtünk, utána ugyanazzal az email + jelszó párossal beléphetsz.');
        return;
      } finally {
        setBetoltes(false);
      }
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

      navigalj('/vezerlopult', { replace: true });
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
          <NavigaciosLink className="rounded-full px-4 py-2 transition hover:bg-white/10" href="/">
            Vissza a főoldalra
          </NavigaciosLink>
          <div className="flex flex-wrap gap-3">
            <NavigaciosLink className="rounded-full px-4 py-2 transition hover:bg-white/10" href="/belepes">
              Belépés
            </NavigaciosLink>
            <NavigaciosLink className="rounded-full px-4 py-2 transition hover:bg-white/10" href="/elfelejtett-jelszo">
              Elfelejtett jelszó
            </NavigaciosLink>
            <NavigaciosLink className="rounded-full px-4 py-2 transition hover:bg-white/10" href="/regisztracio">
              Regisztráció
            </NavigaciosLink>
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

        {mod === 'regisztracio' && meghivo ? (
          <section className="mt-8 rounded-[1.75rem] border border-starting-primer/25 bg-starting-primer/10 p-6 text-sm text-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-starting-primerVilagos">Ellenőrzött meghívó</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Cég</p>
                <p className="mt-2 text-base font-semibold text-white">{meghivo.cegNev}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Szerepkör</p>
                <p className="mt-2 text-base font-semibold text-white">{szerepkorCimkek[meghivo.szerepkor]}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Lejárat</p>
                <p className="mt-2 text-base font-semibold text-white">{new Date(meghivo.lejarat).toLocaleString('hu-HU')}</p>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
