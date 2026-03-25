// Ez a fájl a Starting nyilvános landing oldalát jeleníti meg erős üzleti értékajánlattal, moduláttekintéssel és CTA blokkokkal.
import { useMemo, useState } from 'react';

import { MarkaJelveny } from '@/komponensek/MarkaJelveny';
import { NavigaciosLink } from '@/komponensek/NavigaciosLink';
import { SzakaszCim } from '@/komponensek/SzakaszCim';
import { TartalomKartya } from '@/komponensek/TartalomKartya';
import type { KiemeltKartya } from '@/tipusok/tartalom';

const foFunkciok: KiemeltKartya[] = [
  {
    cim: 'Beléptetés és onboarding',
    leiras: 'Meghívásos regisztráció, szerepkörhöz kötött indulás és egységes auth folyamat a webes és mobilos használathoz.',
  },
  {
    cim: 'Jelenlét és napi státusz',
    leiras: 'Gyors munkakezdés, időbélyegzett státuszkezelés és később riportálható napi jelenléti napló ugyanabban a rendszerben.',
  },
  {
    cim: 'Oktatások és dokumentumok',
    leiras: 'Kötelező anyagok, digitális elfogadások és auditálható visszajelzések egy modern, üzleti felületen.',
  },
  {
    cim: 'Értesítések és események',
    leiras: 'Vezetői figyelmeztetések, admin összefoglalók és strukturált eseményrögzítés a napi működés támogatására.',
  },
];

const vezetoiElonyok: KiemeltKartya[] = [
  {
    cim: 'Átlátható működés',
    leiras: 'A vezetők egy közös rendszerben láthatják a belépéseket, hiányokat, kötelező feladatokat és a kritikus admin állapotokat.',
  },
  {
    cim: 'Kevesebb manuális adminisztráció',
    leiras: 'A napi egyeztetések, papíralapú nyilatkozatok és széttartó kommunikáció helyett egy egységes digitális folyamat jön létre.',
  },
  {
    cim: 'Skálázható szervezeti alap',
    leiras: 'A Starting több cégre, telephelyre, területre és szerepkörre előkészített struktúrát ad a növekedéshez.',
  },
];

const platformKartyak = [
  {
    cim: 'Webes irányítás',
    leiras: 'Admin és vezetői nézetek céges működésre optimalizált kezelőfelülettel, belső modulokkal és védett route-okkal.',
  },
  {
    cim: 'App alapú napi használat',
    leiras: 'Dolgozói élmény gyors napi belépésre, értesítésekre, oktatási visszajelzésekre és későbbi mobil workflow-kra.',
  },
];

const kapcsolatLepesek = [
  'Kapcsolat / érdeklődés blokk már előkészítve a landing oldalon.',
  'CTA-k a belépéshez, regisztrációhoz és üzleti egyeztetéshez igazítva.',
  'A tartalom cégvezetők felé kommunikál: kontroll, átláthatóság, gyors bevezethetőség.',
];

const statisztikak = [
  { cim: 'Célcsoport', ertek: 'Cégvezetők és operatív vezetők' },
  { cim: 'Platform', ertek: 'Web + App egy háttérrendszerrel' },
  { cim: 'Fókusz', ertek: 'Beléptetés, jelenlét, oktatás, admin' },
];

const designElvarasok = [
  'Modern, üzleti és letisztult megjelenés.',
  'Gyorsan átlátható, jól olvasható tartalmi blokkok.',
  'Mobilbarát felület nagy kattintási felületekkel.',
  'Hibátlan magyar ékezetek és következetes megfogalmazás.',
  'Professzionális, megbízható és tiszta színvilág túlzó látványelemek nélkül.',
];

const megvalositasTeruletek = [
  {
    cim: 'Beléptetés és jogosultság',
    leiras: 'Meghívásos regisztráció, valós auth és védett route-ok a napi belépés biztos alapjához.',
    ruta: '/belepes',
    cimke: 'Auth készenlét',
  },
  {
    cim: 'Napi munkakezdés és jelenlét',
    leiras: 'A dolgozói bejelentkezés, státuszrögzítés és visszakereshető jelenléti napló egy közös folyamattá szervezhető.',
    ruta: '/jelenlet',
    cimke: 'Operatív fókusz',
  },
  {
    cim: 'Oktatás és dokumentum-elfogadás',
    leiras: 'Kötelező anyagok, digitális nyilatkozatok és auditálható elfogadások egy összefüggő modulrendszerben.',
    ruta: '/oktatasok',
    cimke: 'Compliance',
  },
  {
    cim: 'Riportok és vezetői kontroll',
    leiras: 'Az admin oldalra épített riportközpont a napi hiányosságok, késések és kötelező feladatok áttekintését támogatja.',
    ruta: '/admin',
    cimke: 'Vezetői nézet',
  },
];

const mintaTesztAdatok = [
  '3 fiktív onboarding modul előkészítve',
  'Minden modul egy kattintható ablakban nyílik meg',
  'Videó helyett lépésenkénti szöveg + Tovább gomb',
  'A végén automatikus Megtekintve státusz',
];

const keszenletiSzintek = [
  {
    terulet: 'Webes értékesítési / landing élmény',
    allapot: 'Erős alap',
    leiras: 'Nyilvános főoldal, üzleti pozicionálás, CTA-k és route-olt információs oldalak elkészítve.',
  },
  {
    terulet: 'Belépés utáni webes működés',
    allapot: 'Működő váz',
    leiras: 'Auth, profilbetöltés, admin dashboard és riportközpont már valós rendszerlogikához közelít.',
  },
  {
    terulet: 'Mobil dolgozói élmény',
    allapot: 'Termékdemó kész',
    leiras: 'A fő mobil képernyők tartalmilag már lefedik a napi munkakezdés, oktatás és értesítés folyamatait.',
  },
  {
    terulet: 'Bevezetési következő lépés',
    allapot: 'Kapcsolat + pilot',
    leiras: 'A landing oldalon már rögzíthető az érdeklődő cég alapadata, így kijelölhető egy demo vagy pilot egyeztetés.',
  },
];

export function Fooldal() {
  const [kapcsolat, setKapcsolat] = useState({
    nev: '',
    email: '',
    ceg: '',
    letszam: '',
    uzenet: '',
  });
  const [sikeresKuldes, setSikeresKuldes] = useState(false);
  const [hibaUzenet, setHibaUzenet] = useState('');

  const kitoltottMezokSzama = useMemo(
    () => Object.values(kapcsolat).filter((ertek) => ertek.trim().length > 0).length,
    [kapcsolat],
  );

  const kezeliValtozast = (mezo: keyof typeof kapcsolat, ertek: string) => {
    setKapcsolat((elozo) => ({
      ...elozo,
      [mezo]: ertek,
    }));
    setSikeresKuldes(false);
    setHibaUzenet('');
  };

  const kezeliKuldes = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!kapcsolat.nev.trim() || !kapcsolat.email.trim() || !kapcsolat.ceg.trim()) {
      setHibaUzenet('A név, email és cégnév mezők kitöltése szükséges az érdeklődés rögzítéséhez.');
      setSikeresKuldes(false);
      return;
    }

    setHibaUzenet('');
    setSikeresKuldes(true);
  };

  return (
    <main className="min-h-screen bg-halo text-starting-sotet">
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-starting-keret/80 bg-white/90 px-6 py-5 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <MarkaJelveny vilagos />
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <a className="rounded-full px-5 py-3 transition hover:bg-slate-100" href="#funkciok">
              Fő funkciók
            </a>
            <a className="rounded-full px-5 py-3 transition hover:bg-slate-100" href="#vezetoknek">
              Vezetőknek
            </a>
            <a className="rounded-full px-5 py-3 transition hover:bg-slate-100" href="#alkalmassag">
              Alkalmasság
            </a>
            <a className="rounded-full px-5 py-3 transition hover:bg-slate-100" href="#kapcsolat">
              Kapcsolat
            </a>
            <NavigaciosLink className="rounded-full border border-starting-keret bg-white px-5 py-3 font-medium text-starting-sotet transition hover:bg-slate-50" href="/belepes">
              Belépés
            </NavigaciosLink>
            <NavigaciosLink className="rounded-full bg-starting-primer px-5 py-3 font-medium text-white transition hover:bg-starting-primerVilagos" href="/regisztracio">
              Regisztráció
            </NavigaciosLink>
          </div>
        </header>

        <div className="grid gap-12 pb-20 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-starting-primer/15 bg-starting-primer/10 px-4 py-2 text-sm font-medium text-starting-primer">
              Modern üzleti rendszer dolgozói működéshez, vezetői kontrollal
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-starting-sotet sm:text-5xl lg:text-6xl">
              Starting – egyetlen platform a dolgozók beléptetésére, napi működésére és vállalati adminisztrációjára.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Röviden: gyorsabb indulás, kevesebb manuális adminisztráció és jobban átlátható napi működés. A Starting a webes vezetői
              felületet és a mobilos dolgozói használatot egy közös rendszerbe rendezi.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <NavigaciosLink
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-starting-primer px-7 py-4 text-base font-semibold text-white transition hover:bg-starting-primerVilagos"
                href="/demo"
              >
                Interaktív demó megnyitása
              </NavigaciosLink>
              <NavigaciosLink
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-starting-keret bg-white px-7 py-4 text-base font-semibold text-starting-sotet transition hover:bg-slate-50"
                href="/regisztracio"
              >
                Fiók létrehozása
              </NavigaciosLink>
              <a
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-starting-keret bg-white px-7 py-4 text-base font-semibold text-starting-sotet transition hover:bg-slate-50"
                href="#kapcsolat"
              >
                Demo egyeztetés
              </a>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {mintaTesztAdatok.map((sor) => (
                <p key={sor} className="rounded-2xl border border-starting-keret/70 bg-white/80 px-4 py-3 text-sm text-slate-600">
                  • {sor}
                </p>
              ))}
            </div>
            <ul className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              {designElvarasok.map((elvaras) => (
                <li key={elvaras} className="rounded-2xl border border-starting-keret/70 bg-white/80 px-4 py-4 shadow-sm">
                  {elvaras}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-starting-keret/70 bg-white p-6 shadow-kartya">
            <div className="grid gap-4">
              {statisztikak.map((statisztika) => (
                <div key={statisztika.cim} className="rounded-2xl border border-starting-keret/70 bg-starting-felulet p-5">
                  <p className="text-sm text-slate-500">{statisztika.cim}</p>
                  <p className="mt-2 text-xl font-semibold text-starting-sotet">{statisztika.ertek}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-starting-primer/15 bg-starting-primer/5 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-starting-primer">Miért erős ajánlat?</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <li>• a vezetői nézet és a dolgozói használat ugyanarra az adatra épül</li>
                <li>• a belépéstől az oktatásig minden egy rendszerben marad</li>
                <li>• a Starting márka modern, üzleti és könnyen továbbépíthető</li>
                <li>• az érdeklődési és kapcsolatfelvételi hely már most elő van készítve</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="funkciok" className="border-y border-starting-keret/70 bg-white/70 px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SzakaszCim
            felirat="Fő funkciók"
            cim="A Starting a napi működés legfontosabb pontjait fogja össze"
            leiras="A landing oldal tartalma most már közvetlenül kapcsolódik azokhoz a modulokhoz, amelyekhez a webes felületen már route-ok is tartoznak."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {foFunkciok.map((funkcio, index) => (
              <TartalomKartya key={funkcio.cim} cim={funkcio.cim} leiras={funkcio.leiras}>
                <span className="text-lg font-bold">0{index + 1}</span>
              </TartalomKartya>
            ))}
          </div>
        </div>
      </section>

      <section id="vezetoknek" className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SzakaszCim
            felirat="Cégvezetőknek"
            cim="Üzleti nyelven kommunikál: kontroll, egyszerűség, bevezethetőség"
            leiras="A fő üzenet most már egyértelműen a vezetői értékre épít: kevesebb káosz, gyorsabb adminisztráció és egységesebb napi működés weben és appban."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {vezetoiElonyok.map((elony) => (
              <div key={elony.cim} className="rounded-[2rem] border border-starting-keret/70 bg-white p-7 shadow-kartya">
                <h3 className="text-xl font-semibold text-starting-sotet">{elony.cim}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{elony.leiras}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-starting-keret/70 bg-slate-50/80 px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-starting-primer">Web + app</p>
            <h2 className="mt-4 text-3xl font-semibold text-starting-sotet sm:text-4xl">Kiemelten kommunikálja, hogy a rendszer nem csak webes admin felület.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              A Starting pozicionálása így egyértelmű: a vezetők weben irányítanak, a dolgozók pedig appban vagy mobilról is használhatják a napi folyamatokat,
              miközben minden ugyanahhoz a háttérrendszerhez kapcsolódik.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {platformKartyak.map((kartya) => (
              <article key={kartya.cim} className="rounded-[1.75rem] border border-starting-keret/70 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-starting-sotet">{kartya.cim}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{kartya.leiras}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="alkalmassag" className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SzakaszCim
            felirat="Feladatra alkalmasság"
            cim="A web és az app is ugyanarra a konkrét működési problémára van hangolva"
            leiras="A felület már nem csak általános bemutató, hanem egyértelműen a munkakezdés, jelenlét, oktatás, dokumentum-elfogadás és vezetői utánkövetés közös rendszerét kommunikálja."
          />

          <div className="mt-12 grid gap-6 xl:grid-cols-4">
            {megvalositasTeruletek.map((terulet) => (
              <article key={terulet.cim} className="rounded-[1.75rem] border border-starting-keret/70 bg-white p-6 shadow-kartya">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-starting-primer">{terulet.cimke}</p>
                <h3 className="mt-3 text-xl font-semibold text-starting-sotet">{terulet.cim}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{terulet.leiras}</p>
                <NavigaciosLink
                  className="mt-6 inline-flex items-center justify-center rounded-full border border-starting-keret px-4 py-3 text-sm font-semibold text-starting-sotet transition hover:bg-slate-50"
                  href={terulet.ruta}
                >
                  Modul megnyitása
                </NavigaciosLink>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-starting-primer/15 bg-starting-primer/5 p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-starting-primer">Mit lát egy döntéshozó?</p>
              <h3 className="mt-4 text-2xl font-semibold text-starting-sotet">Készültségi térkép a bevezetési beszélgetéshez</h3>
              <div className="mt-6 space-y-4">
                {keszenletiSzintek.map((szint) => (
                  <div key={szint.terulet} className="rounded-2xl border border-starting-keret/70 bg-white/90 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h4 className="text-base font-semibold text-starting-sotet">{szint.terulet}</h4>
                      <span className="rounded-full bg-starting-primer/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-starting-primer">
                        {szint.allapot}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{szint.leiras}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-starting-keret/70 bg-slate-950 p-8 text-white shadow-kartya">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-starting-primerVilagos">Mi hiányzik a következő lépéshez?</p>
              <h3 className="mt-4 text-2xl font-semibold">Pilot adatok, szervezeti döntések és célzott backend bekötés</h3>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
                <li>• céges és telephely struktúra véglegesítése</li>
                <li>• meghívásos onboarding és profil trigger élesítése</li>
                <li>• jelenléti és oktatási adatok Supabase táblákhoz kötése</li>
                <li>• értesítési és riport szabályok pilot céges adatokkal finomhangolása</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="kapcsolat" className="border-t border-starting-keret/70 px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-starting-keret/70 bg-white p-8 shadow-kartya">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-starting-primer">Kapcsolat / érdeklődés</p>
            <h2 className="mt-3 text-3xl font-semibold text-starting-sotet sm:text-4xl">Az érdeklődés rögzítése már konkrét pilot beszélgetésre van hangolva.</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              A landing oldal most már nem csak helyet tart fenn a kapcsolatfelvételnek, hanem összegyűjti azokat az alapinformációkat is, amelyek egy demo,
              bevezetési workshop vagy pilot egyeztetés előkészítéséhez szükségesek.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {kapcsolatLepesek.map((lepespont) => (
                <li key={lepespont}>• {lepespont}</li>
              ))}
            </ul>
            <div className="mt-8 rounded-[1.5rem] border border-starting-primer/15 bg-starting-primer/5 p-5">
              <p className="text-sm font-semibold text-starting-sotet">Űrlap előrehaladás</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {kitoltottMezokSzama}/5 mező kitöltve. A minimális demo-egyeztetéshez név, email és cégnév szükséges.
              </p>
            </div>
          </div>

          <form className="rounded-[2rem] border border-starting-keret/70 bg-white p-8 shadow-kartya" onSubmit={kezeliKuldes}>
            {hibaUzenet ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{hibaUzenet}</div> : null}
            {sikeresKuldes ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Érdeklődés rögzítve a felületen. A következő iterációban ez a blokk közvetlen CRM vagy email workflow-ra is köthető.
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Kapcsolattartó neve</span>
                <input
                  className="w-full rounded-2xl border border-starting-keret bg-starting-felulet px-4 py-3 outline-none transition focus:border-starting-primer"
                  placeholder="Minta Márton"
                  value={kapcsolat.nev}
                  onChange={(event) => kezeliValtozast('nev', event.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Munkahelyi email</span>
                <input
                  className="w-full rounded-2xl border border-starting-keret bg-starting-felulet px-4 py-3 outline-none transition focus:border-starting-primer"
                  placeholder="vezeto@ceg.hu"
                  type="email"
                  value={kapcsolat.email}
                  onChange={(event) => kezeliValtozast('email', event.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Cégnév</span>
                <input
                  className="w-full rounded-2xl border border-starting-keret bg-starting-felulet px-4 py-3 outline-none transition focus:border-starting-primer"
                  placeholder="Starting Mintacég Kft."
                  value={kapcsolat.ceg}
                  onChange={(event) => kezeliValtozast('ceg', event.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Dolgozói létszám</span>
                <input
                  className="w-full rounded-2xl border border-starting-keret bg-starting-felulet px-4 py-3 outline-none transition focus:border-starting-primer"
                  placeholder="50-120 fő"
                  value={kapcsolat.letszam}
                  onChange={(event) => kezeliValtozast('letszam', event.target.value)}
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Melyik területre keresnek megoldást?</span>
              <textarea
                className="min-h-36 w-full rounded-2xl border border-starting-keret bg-starting-felulet px-4 py-3 outline-none transition focus:border-starting-primer"
                placeholder="Pl. meghívásos beléptetés, napi jelenlét, kötelező oktatások, dokumentum-elfogadás, vezetői riportok..."
                value={kapcsolat.uzenet}
                onChange={(event) => kezeliValtozast('uzenet', event.target.value)}
              />
            </label>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <button
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-starting-primer px-6 py-4 font-semibold text-white transition hover:bg-starting-primerVilagos"
                type="submit"
              >
                Demo igény rögzítése
              </button>
              <a
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-starting-keret px-6 py-4 font-semibold text-starting-sotet transition hover:bg-slate-50"
                href="mailto:hello@starting.hu"
              >
                Közvetlen email
              </a>
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-starting-keret/70 px-6 py-8 text-sm text-slate-500 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Starting. Digitális működés weben és mobilon.</p>
          <div className="flex flex-wrap gap-4">
            <NavigaciosLink className="transition hover:text-starting-sotet" href="/adatkezeles">
              Adatkezelés
            </NavigaciosLink>
            <NavigaciosLink className="transition hover:text-starting-sotet" href="/aszf">
              ÁSZF
            </NavigaciosLink>
            <NavigaciosLink className="transition hover:text-starting-sotet" href="/elfelejtett-jelszo">
              Elfelejtett jelszó
            </NavigaciosLink>
          </div>
        </div>
      </footer>
    </main>
  );
}
