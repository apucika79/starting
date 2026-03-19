// Ez a fájl a belépés utáni webes fiókoldalt jeleníti meg, már profil- és szerepkör-betöltéssel.
import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { NavigaciosLink } from '@/komponensek/NavigaciosLink';
import { kilepes } from '@/szolgaltatasok/auth';
import { navigalj } from '@/segedek/navigacio';
import { profilBetoltese } from '@/szolgaltatasok/profil';
import type { ProfilAdat } from '@/tipusok/profil';

const szerepkorCimkek: Record<ProfilAdat['szerepkor'], string> = {
  szuperadmin: 'Szuperadmin',
  ceg_admin: 'Cégadmin',
  terulet_vezeto: 'Területvezető',
  dolgozo: 'Dolgozó',
};

const statuszCimkek: Record<ProfilAdat['statusz'], string> = {
  aktiv: 'Aktív',
  inaktiv: 'Inaktív',
  torolt: 'Törölt',
};

const authKeszsegPontok = [
  'Email + jelszó alapú belépés éles Supabase Auth folyamattal.',
  'Meghívásos, szerepkörhöz kötött regisztráció tokenellenőrzéssel.',
  'Elfelejtett jelszó kérés és recovery-linkes új jelszó beállítás.',
  'Védett oldalak automatikus átirányítással és perzisztens session-kezeléssel.',
];

type FiokOldalTulajdonsagok = {
  session: Session;
};

type Allapot = 'betoltes' | 'siker' | 'hiba';

export function FiokOldal({ session }: FiokOldalTulajdonsagok) {
  const [profil, setProfil] = useState<ProfilAdat | null>(null);
  const [allapot, setAllapot] = useState<Allapot>('betoltes');
  const [hibaUzenet, setHibaUzenet] = useState('');

  useEffect(() => {
    let aktiv = true;

    const betolt = async () => {
      setAllapot('betoltes');
      setHibaUzenet('');

      const { data, error } = await profilBetoltese(session.user.id);

      if (!aktiv) {
        return;
      }

      if (error) {
        setProfil(null);
        setAllapot('hiba');
        setHibaUzenet('A profil betöltése nem sikerült. Ellenőrizd, hogy a profil rekord és az olvasási jogosultság elérhető-e a Supabase projektben.');
        return;
      }

      if (!data) {
        setProfil(null);
        setAllapot('hiba');
        setHibaUzenet('Nincs még profil rekord ehhez a felhasználóhoz. Ellenőrizd, hogy a meghívásos regisztrációhoz szükséges adatbázis trigger telepítve lett-e.');
        return;
      }

      setProfil(data);
      setAllapot('siker');
    };

    void betolt();

    return () => {
      aktiv = false;
    };
  }, [session.user.id]);

  const email = session.user.email ?? 'ismeretlen felhasználó';
  const megjelenitettNev = profil?.teljes_nev ?? session.user.user_metadata.teljes_nev ?? 'Profil előkészítés alatt';
  const szervezetiAdatok = useMemo(
    () => [
      { cimke: 'Szerepkör', ertek: profil ? szerepkorCimkek[profil.szerepkor] : 'Betöltés alatt' },
      { cimke: 'Státusz', ertek: profil ? statuszCimkek[profil.statusz] : 'Betöltés alatt' },
      { cimke: 'Cég', ertek: profil?.ceg?.nev ?? 'Még nincs hozzárendelve' },
      { cimke: 'Telephely', ertek: profil?.telephely?.nev ?? 'Még nincs hozzárendelve' },
      { cimke: 'Terület', ertek: profil?.terulet?.nev ?? 'Még nincs hozzárendelve' },
    ],
    [profil],
  );

  const sessionLejar = session.expires_at ? new Date(session.expires_at * 1000).toLocaleString('hu-HU') : 'Automatikusan kezelt';

  const kezeliKilepest = async () => {
    await kilepes();
    navigalj('/belepes', { replace: true });
  };

  return (
    <main className="min-h-screen bg-halo px-6 py-6 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-kartya backdrop-blur sm:p-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-starting-primerVilagos">Belső felület</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Belépés után betöltött profil és szerepkör áttekintés.</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
              Ez a nézet a védett munkamenet alapján betölti a profiladatokat, és megmutatja, hogy a felhasználó milyen szervezeti kontextussal
              és milyen szerepkörrel érkezett meg a rendszerbe.
            </p>
          </div>
          <NavigaciosLink
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Vissza a főoldalra
          </NavigaciosLink>
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-starting-primer/20 bg-starting-primer/10 p-6">
              <p className="text-sm text-slate-300">Bejelentkezett felhasználó</p>
              <p className="mt-3 text-2xl font-semibold text-white">{megjelenitettNev}</p>
              <p className="mt-2 text-sm text-starting-primerVilagos">{email}</p>
              <p className="mt-4 text-sm leading-7 text-slate-200">
                {profil?.telefonszam
                  ? `Kapcsolati telefonszám: ${profil.telefonszam}`
                  : 'A profilhoz tartozó telefonszám még nincs kitöltve, de a szerkezet már készen áll a további adatbetöltéshez.'}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">Profil és szervezeti adatok</h2>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                  {allapot === 'betoltes' ? 'Betöltés' : allapot === 'hiba' ? 'Figyelem' : 'Szinkronban'}
                </span>
              </div>

              {allapot === 'hiba' ? (
                <div className="mt-5 rounded-2xl border border-amber-400/25 bg-amber-500/10 p-4 text-sm leading-7 text-amber-100">
                  {hibaUzenet}
                </div>
              ) : null}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {szervezetiAdatok.map((adat) => (
                  <div key={adat.cimke} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{adat.cimke}</p>
                    <p className="mt-3 text-base font-semibold text-white">{adat.ertek}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
              <h2 className="text-lg font-semibold text-white">Auth státusz</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                {authKeszsegPontok.map((tetel) => (
                  <li key={tetel}>• {tetel}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
              <h2 className="text-lg font-semibold text-white">Aktív munkamenet</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Felhasználó azonosító</p>
                  <p className="mt-3 break-all text-sm font-semibold text-white">{session.user.id}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Session lejárat</p>
                  <p className="mt-3 text-sm font-semibold text-white">{sessionLejar}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                A kliensoldali session tárolás, a tokenfrissítés és az auth eseményfigyelés a Supabase kliensben aktív, ezért a védett útvonalak újratöltés
                után is ellenőrzött módon működnek.
              </p>
            </div>

            <button
              type="button"
              onClick={kezeliKilepest}
              className="inline-flex w-full items-center justify-center rounded-full bg-starting-primer px-6 py-3.5 text-base font-semibold text-white transition hover:bg-starting-primerVilagos"
            >
              Kijelentkezés
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
