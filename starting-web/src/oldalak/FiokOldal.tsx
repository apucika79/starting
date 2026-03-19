// Ez a fájl a belépés utáni webes fiókoldalt jeleníti meg, már profil- és szerepkör-betöltéssel.
import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { NavigaciosLink } from '@/komponensek/NavigaciosLink';
import { kilepes } from '@/szolgaltatasok/auth';
import { ertesitesiAttekintesKeszitese, ertesitesekBetoltese } from '@/szolgaltatasok/ertesitesek';
import { navigalj } from '@/segedek/navigacio';
import { profilBetoltese } from '@/szolgaltatasok/profil';
import type { Ertesites } from '@/tipusok/ertesites';
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

const digitalisNyilatkozatFejezetek = [
  {
    cim: 'Munkavégzési és adatkezelési nyilatkozat',
    torzs:
      'A dokumentum megerősíti, hogy a dolgozó megismerte a munkavégzéshez kapcsolódó digitális folyamatokat, az adatkezelési elveket és az előírt vállalati szabályokat.',
  },
  {
    cim: 'Elfogadási feltételek',
    torzs:
      'Az elfogadással a felhasználó igazolja, hogy a tájékoztató tartalmát elolvasta, megértette, és a rendszerben rögzített névvel jóváhagyja a nyilatkozatot.',
  },
  {
    cim: 'Audit és visszakereshetőség',
    torzs:
      'A rendszer az elfogadás időpontját, a megerősített nevet és a státuszváltozásokat naplózza, hogy a későbbi audit és ellenőrzés támogatott legyen.',
  },
];

type FiokOldalTulajdonsagok = {
  session: Session;
};

type Allapot = 'betoltes' | 'siker' | 'hiba';
type AlairasStatusz = 'várakozik' | 'elfogadva';

const ertesitesTipusCimkek: Record<Ertesites['tipus'], string> = {
  rendszeruzenet: 'Rendszerüzenet',
  kotelezo_oktatas: 'Kötelező oktatás',
  hianyzo_napi_belepes: 'Hiányzó napi belépés',
  admin_osszefoglalo: 'Admin lista',
};

const prioritasCimkeOsztalyok: Record<Ertesites['prioritas'], string> = {
  alacsony: 'border-slate-500/30 bg-slate-500/10 text-slate-200',
  normal: 'border-sky-400/30 bg-sky-500/10 text-sky-100',
  magas: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
  kritikus: 'border-rose-400/30 bg-rose-500/10 text-rose-100',
};

type StatuszNaplobejegyzes = {
  id: number;
  statusz: AlairasStatusz;
  leiras: string;
  idobelyeg: string;
};

const formatalIdobelyeg = (datum: Date) =>
  datum.toLocaleString('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

export function FiokOldal({ session }: FiokOldalTulajdonsagok) {
  const [profil, setProfil] = useState<ProfilAdat | null>(null);
  const [allapot, setAllapot] = useState<Allapot>('betoltes');
  const [hibaUzenet, setHibaUzenet] = useState('');
  const [elfogadva, setElfogadva] = useState(false);
  const [megerositoNev, setMegerositoNev] = useState('');
  const [alairasStatusz, setAlairasStatusz] = useState<AlairasStatusz>('várakozik');
  const [alairasiIdobelyeg, setAlairasiIdobelyeg] = useState('');
  const [alairasiHiba, setAlairasiHiba] = useState('');
  const [ertesitesek, setErtesitesek] = useState<Ertesites[]>([]);
  const [statuszNaplo, setStatuszNaplo] = useState<StatuszNaplobejegyzes[]>(() => [
    {
      id: Date.now(),
      statusz: 'várakozik',
      leiras: 'A digitális nyilatkozat előkészítve, aláírásra vár.',
      idobelyeg: formatalIdobelyeg(new Date()),
    },
  ]);

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
    void ertesitesekBetoltese().then((adatok) => {
      if (aktiv) {
        setErtesitesek(adatok);
      }
    });

    return () => {
      aktiv = false;
    };
  }, [session.user.id]);

  const email = session.user.email ?? 'ismeretlen felhasználó';
  const megjelenitettNev = profil?.teljes_nev ?? session.user.user_metadata.teljes_nev ?? 'Profil előkészítés alatt';

  useEffect(() => {
    if (!megerositoNev.trim() && megjelenitettNev !== 'Profil előkészítés alatt') {
      setMegerositoNev(megjelenitettNev);
    }
  }, [megerositoNev, megjelenitettNev]);

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
  const nevEgyezik = megerositoNev.trim().toLocaleLowerCase('hu-HU') === megjelenitettNev.trim().toLocaleLowerCase('hu-HU');
  const ertesitesiAttekintes = useMemo(() => ertesitesiAttekintesKeszitese(ertesitesek), [ertesitesek]);
  const adminErtesitesek = useMemo(() => ertesitesek.filter((ertesites) => ertesites.adminListabanMegjelenik), [ertesitesek]);

  const rogzitAlairast = () => {
    if (!elfogadva) {
      setAlairasiHiba('Az elfogadási jelölőnégyzetet be kell pipálnod a folytatáshoz.');
      return;
    }

    if (!megerositoNev.trim()) {
      setAlairasiHiba('Add meg a teljes nevedet a digitális megerősítéshez.');
      return;
    }

    if (!nevEgyezik) {
      setAlairasiHiba('A megadott névnek egyeznie kell a bejelentkezett felhasználó nevével.');
      return;
    }

    const most = formatalIdobelyeg(new Date());

    setAlairasStatusz('elfogadva');
    setAlairasiIdobelyeg(most);
    setAlairasiHiba('');
    setStatuszNaplo((elozo) => [
      {
        id: Date.now(),
        statusz: 'elfogadva',
        leiras: `Digitális elfogadás rögzítve a következő névvel: ${megerositoNev.trim()}.`,
        idobelyeg: most,
      },
      ...elozo,
    ]);
  };

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

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-starting-primerVilagos">9. értesítések</p>
                  <h2 className="mt-2 text-lg font-semibold text-white">Értesítési alapstruktúra</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                  {ertesitesiAttekintes.osszesen} elem
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Összesen</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{ertesitesiAttekintes.osszesen}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Olvasatlan</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{ertesitesiAttekintes.olvasatlan}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Kritikus</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{ertesitesiAttekintes.kritikus}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Admin listában</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{ertesitesiAttekintes.adminListas}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-3">
                  {ertesitesek.map((ertesites) => (
                    <article key={ertesites.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-starting-primerVilagos">
                            {ertesitesTipusCimkek[ertesites.tipus]}
                          </p>
                          <h3 className="mt-2 text-base font-semibold text-white">{ertesites.cim}</h3>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${prioritasCimkeOsztalyok[ertesites.prioritas]}`}>
                          {ertesites.prioritas}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{ertesites.uzenet}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span>Csatorna: {ertesites.csatorna}</span>
                        <span>•</span>
                        <span>{ertesites.letrehozva}</span>
                        <span>•</span>
                        <span>{ertesites.olvasott ? 'Olvasott' : 'Olvasatlan'}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {ertesites.akcioCimke && ertesites.akcioUrl ? (
                          <a
                            href={ertesites.akcioUrl}
                            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                          >
                            {ertesites.akcioCimke}
                          </a>
                        ) : null}
                        <span className="text-xs text-slate-400">
                          {ertesites.pushHelyFenntartva ? 'Push hely előkészítve.' : 'Csak in-app megjelenítés.'}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <h3 className="text-base font-semibold text-white">Admin értesítési lista alap</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Az admin nézet külön listát kap azokról az értesítésekről, amelyek szervezeti követést, utánkövetést vagy napi ellenőrzést igényelnek.
                    </p>
                    <ul className="mt-4 space-y-3">
                      {adminErtesitesek.map((ertesites) => (
                        <li key={ertesites.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                          <p className="text-sm font-semibold text-white">{ertesites.cim}</p>
                          <p className="mt-2 text-sm leading-7 text-slate-300">{ertesitesTipusCimkek[ertesites.tipus]}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.5rem] border border-dashed border-starting-primer/30 bg-starting-primer/5 p-5">
                    <h3 className="text-base font-semibold text-white">Push értesítés későbbi helye</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      A struktúra elkülöníti a csatornát és a push-előkészítési állapotot, így a későbbi mobil push küldés külön migráció nélkül ráépíthető a mostani in-app értesítésekre.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-starting-primerVilagos">7. digitális nyilatkozat / aláírás</p>
                  <h2 className="mt-2 text-lg font-semibold text-white">Dokumentummegjelenítés és digitális elfogadás</h2>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
                    alairasStatusz === 'elfogadva'
                      ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
                      : 'border-amber-400/30 bg-amber-500/10 text-amber-100'
                  }`}
                >
                  {alairasStatusz}
                </span>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Nyilatkozat dokumentum</p>
                    <p className="mt-1 text-sm text-slate-400">Megjeleníthető, görgethető tartalom auditált elfogadáshoz.</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                    3 fejezet
                  </span>
                </div>

                <div className="mt-4 max-h-72 space-y-4 overflow-y-auto pr-2">
                  {digitalisNyilatkozatFejezetek.map((fejezet, index) => (
                    <article key={fejezet.cim} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-starting-primerVilagos">Fejezet {index + 1}</p>
                      <h3 className="mt-2 text-base font-semibold text-white">{fejezet.cim}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{fejezet.torzs}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-7 text-slate-200">
                    <input
                      type="checkbox"
                      checked={elfogadva}
                      onChange={(event) => setElfogadva(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-900 text-starting-primer focus:ring-starting-primer"
                    />
                    <span>Elfogadom a dokumentumban szereplő nyilatkozatot, és vállalom, hogy a rendszer az elfogadás tényét naplózza.</span>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-200">Megerősítés teljes névvel</span>
                    <input
                      type="text"
                      value={megerositoNev}
                      onChange={(event) => setMegerositoNev(event.target.value)}
                      placeholder="Írd be a teljes neved"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-starting-primer"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Időbélyeg</p>
                      <p className="mt-3 text-sm font-semibold text-white">{alairasiIdobelyeg || 'Még nincs rögzítve'}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Név egyezése</p>
                      <p className={`mt-3 text-sm font-semibold ${nevEgyezik ? 'text-emerald-300' : 'text-amber-200'}`}>
                        {nevEgyezik ? 'Ellenőrizve' : 'Eltérés vagy hiányzó név'}
                      </p>
                    </div>
                  </div>

                  {alairasiHiba ? (
                    <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm leading-7 text-rose-100">{alairasiHiba}</div>
                  ) : null}

                  <button
                    type="button"
                    onClick={rogzitAlairast}
                    className="inline-flex w-full items-center justify-center rounded-full bg-starting-primer px-6 py-3.5 text-base font-semibold text-white transition hover:bg-starting-primerVilagos"
                  >
                    Nyilatkozat digitális elfogadása
                  </button>
                </div>

                <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/60 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Rajzolt aláírás helye</p>
                    <div className="mt-4 flex min-h-36 items-center justify-center rounded-2xl border border-dashed border-starting-primer/30 bg-starting-primer/5 px-4 text-center text-sm leading-7 text-slate-300">
                      Későbbi iterációhoz előkészített hely a rajzolt vagy érintőképernyős aláírásmező számára.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-white">Aláírás státusznapló</h3>
                      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{statuszNaplo.length} bejegyzés</span>
                    </div>

                    <ol className="mt-4 space-y-3">
                      {statuszNaplo.map((bejegyzes) => (
                        <li key={bejegyzes.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span
                              className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${
                                bejegyzes.statusz === 'elfogadva'
                                  ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
                                  : 'border-amber-400/30 bg-amber-500/10 text-amber-100'
                              }`}
                            >
                              {bejegyzes.statusz}
                            </span>
                            <span className="text-xs text-slate-400">{bejegyzes.idobelyeg}</span>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-slate-300">{bejegyzes.leiras}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
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
