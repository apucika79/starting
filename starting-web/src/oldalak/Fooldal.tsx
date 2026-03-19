// Ez a fájl a Starting nyilvános landing oldalát jeleníti meg erős üzleti értékajánlattal, moduláttekintéssel és CTA blokkokkal.
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

export function Fooldal() {
  return (
    <main className="min-h-screen bg-halo text-white">
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <MarkaJelveny />
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <a className="rounded-full px-4 py-2 transition hover:bg-white/10" href="#funkciok">
              Fő funkciók
            </a>
            <a className="rounded-full px-4 py-2 transition hover:bg-white/10" href="#vezetoknek">
              Vezetőknek
            </a>
            <a className="rounded-full px-4 py-2 transition hover:bg-white/10" href="#kapcsolat">
              Kapcsolat
            </a>
            <NavigaciosLink className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-medium text-white transition hover:bg-white/10" href="/belepes">
              Belépés
            </NavigaciosLink>
            <NavigaciosLink className="rounded-full bg-starting-primer px-5 py-2.5 font-medium text-white transition hover:bg-starting-primerVilagos" href="/regisztracio">
              Regisztráció
            </NavigaciosLink>
          </div>
        </header>

        <div className="grid gap-12 pb-20 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-starting-primer/30 bg-starting-primer/10 px-4 py-2 text-sm font-medium text-starting-primerVilagos">
              Modern üzleti rendszer dolgozói működéshez, vezetői kontrollal
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Starting – egyetlen platform a dolgozók beléptetésére, napi működésére és vállalati adminisztrációjára.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Röviden: gyorsabb indulás, kevesebb manuális adminisztráció és jobban átlátható napi működés. A Starting a webes vezetői
              felületet és a mobilos dolgozói használatot egy közös rendszerbe rendezi.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <NavigaciosLink
                className="inline-flex items-center justify-center rounded-full bg-starting-primer px-6 py-3.5 text-base font-semibold text-white transition hover:bg-starting-primerVilagos"
                href="/regisztracio"
              >
                Kipróbálom a rendszert
              </NavigaciosLink>
              <a
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
                href="#kapcsolat"
              >
                Érdeklődés előkészítése
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-kartya backdrop-blur">
            <div className="grid gap-4">
              {statisztikak.map((statisztika) => (
                <div key={statisztika.cim} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">{statisztika.cim}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{statisztika.ertek}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-starting-primer/20 bg-gradient-to-br from-starting-primer/20 to-sky-400/10 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-starting-primerVilagos">Miért erős ajánlat?</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                <li>• a vezetői nézet és a dolgozói használat ugyanarra az adatra épül</li>
                <li>• a belépéstől az oktatásig minden egy rendszerben marad</li>
                <li>• a Starting márka modern, üzleti és könnyen továbbépíthető</li>
                <li>• az érdeklődési és kapcsolatfelvételi hely már most elő van készítve</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="funkciok" className="border-y border-white/10 bg-slate-950/50 px-6 py-20 sm:px-8 lg:px-10">
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
              <div key={elony.cim} className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-kartya backdrop-blur">
                <h3 className="text-xl font-semibold text-white">{elony.cim}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{elony.leiras}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/40 px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-starting-primerVilagos">Web + app</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Kiemelten kommunikálja, hogy a rendszer nem csak webes admin felület.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              A Starting pozicionálása így egyértelmű: a vezetők weben irányítanak, a dolgozók pedig appban vagy mobilról is használhatják a napi folyamatokat,
              miközben minden ugyanahhoz a háttérrendszerhez kapcsolódik.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {platformKartyak.map((kartya) => (
              <article key={kartya.cim} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-semibold text-white">{kartya.cim}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{kartya.leiras}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="kapcsolat" className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-starting-primer/30 bg-gradient-to-r from-starting-primer/20 via-slate-900 to-sky-500/20 p-8 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-starting-primerVilagos">Kapcsolat / érdeklődés</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">A kapcsolatfelvétel helye is elő van készítve a következő iterációhoz.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
              A landing oldal már alkalmas arra, hogy ide kerüljön ajánlatkérés, demo igénylés vagy közvetlen üzleti kapcsolatfelvétel. Addig is a CTA-k és a
              blokkstruktúra egyértelműen kijelölik ennek a helyét.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-100">
              {kapcsolatLepesek.map((lepespont) => (
                <li key={lepespont}>• {lepespont}</li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:mt-0 lg:flex-col">
            <a className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-slate-100" href="mailto:hello@starting.hu">
              Kapcsolat előkészítve
            </a>
            <NavigaciosLink className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10" href="/belepes">
              Belépés a rendszerbe
            </NavigaciosLink>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-sm text-slate-400 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Starting. Digitális működés weben és mobilon.</p>
          <div className="flex flex-wrap gap-4">
            <NavigaciosLink className="transition hover:text-white" href="/adatkezeles">
              Adatkezelés
            </NavigaciosLink>
            <NavigaciosLink className="transition hover:text-white" href="/aszf">
              ÁSZF
            </NavigaciosLink>
            <NavigaciosLink className="transition hover:text-white" href="/elfelejtett-jelszo">
              Elfelejtett jelszó
            </NavigaciosLink>
          </div>
        </div>
      </footer>
    </main>
  );
}
