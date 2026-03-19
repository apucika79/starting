// Ez a fájl a Starting nyilvános landing oldalát jeleníti meg, reszponzív hero, funkciók, előnyök és CTA blokkokkal.
import { MarkaJelveny } from '@/komponensek/MarkaJelveny';
import { NavigaciosLink } from '@/komponensek/NavigaciosLink';
import { SzakaszCim } from '@/komponensek/SzakaszCim';
import { TartalomKartya } from '@/komponensek/TartalomKartya';
import { alkalmazasKonfiguracio } from '@/segedek/konfiguracio';
import type { KiemeltKartya } from '@/tipusok/tartalom';

const foFunkciok: KiemeltKartya[] = [
  {
    cim: 'Munkakezdés és jelenlét',
    leiras: 'Gyors napi belépés, státuszrögzítés és naplózás weben és mobilon, egy közös háttérrendszerrel.',
  },
  {
    cim: 'Beléptetés és kötelező folyamatok',
    leiras: 'Dolgozói meghívás, kötelező lépések végigvezetése, digitális elfogadás és dokumentumkezelés egy helyen.',
  },
  {
    cim: 'Oktatás és megfelelés',
    leiras: 'Videók, dokumentumok, kötelező anyagok, teljesítési állapotok és naplózott visszaigazolások modern felületen.',
  },
  {
    cim: 'Események és jegyzőkönyvek',
    leiras: 'Eseményrögzítés rövid leírással, kategóriával, dátummal, csatolmányokkal és admin láthatósági szabályokkal.',
  },
];

const elonyok: KiemeltKartya[] = [
  {
    cim: 'Többcégre előkészített működés',
    leiras: 'A Starting alapstruktúrája több cég, telephely és jogosultsági szint későbbi bővítésére épül.',
  },
  {
    cim: 'Magyar nyelvű üzleti élmény',
    leiras: 'Az egész rendszer magyar nyelven, világos szövegekkel és üzleti célú felhasználói élménnyel készül.',
  },
  {
    cim: 'Stabil, bővíthető technológia',
    leiras: 'React, Expo és Supabase alapokra épülő rendszer, amely gyorsan fejleszthető és könnyen fenntartható.',
  },
];

const statisztikak = [
  { cim: '1 platform', ertek: 'Web + App' },
  { cim: '4 fő szerepkör', ertek: 'Szigorú hozzáférés' },
  { cim: '1 domain', ertek: 'starting.hu' },
];

export function Fooldal() {
  return (
    <main className="min-h-screen bg-halo text-white">
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <MarkaJelveny />
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <a className="rounded-full px-4 py-2 transition hover:bg-white/10" href="#funkciok">
              Funkciók
            </a>
            <a className="rounded-full px-4 py-2 transition hover:bg-white/10" href="#elonyok">
              Előnyök
            </a>
            <NavigaciosLink className="rounded-full bg-starting-primer px-5 py-2.5 font-medium text-white transition hover:bg-starting-primerVilagos" href="/belepes">
              Belépés
            </NavigaciosLink>
          </div>
        </header>

        <div className="grid gap-12 pb-20 pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-starting-primer/30 bg-starting-primer/10 px-4 py-2 text-sm font-medium text-starting-primerVilagos">
              Professzionális digitális munkakezdés és jelenlétkezelés
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Starting – egységes rendszer a dolgozók beléptetéséhez, jelenlétéhez, oktatásához és napi adminisztrációjához.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Modern webes és mobilos megoldás vállalatoknak, amely egyszerűsíti a munkakezdést, követi a napi státuszokat,
              és előkészíti a későbbi NAV / EFO / munkaügyi bővítéseket.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <NavigaciosLink
                className="inline-flex items-center justify-center rounded-full bg-starting-primer px-6 py-3.5 text-base font-semibold text-white transition hover:bg-starting-primerVilagos"
                href="/regisztracio"
              >
                Indulás a Starting rendszerrel
              </NavigaciosLink>
              <a
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
                href={alkalmazasKonfiguracio.domain}
              >
                Domain előkészítés: {alkalmazasKonfiguracio.domain.replace('https://', '')}
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-kartya backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {statisztikak.map((statisztika) => (
                <div key={statisztika.cim} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">{statisztika.cim}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{statisztika.ertek}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-starting-primer/20 bg-gradient-to-br from-starting-primer/20 to-sky-400/10 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-starting-primerVilagos">Egy közös háttérrendszer</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                <li>• webes admin és vállalati felület</li>
                <li>• mobilos dolgozói élmény napi használatra</li>
                <li>• egységes adatbázis és jogosultságkezelés</li>
                <li>• későbbi értesítési és integrációs bővítésekhez előkészítve</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="funkciok" className="border-y border-white/10 bg-slate-950/50 px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SzakaszCim
            felirat="Fő funkciók"
            cim="Minden lényeges munkafolyamat egy helyen"
            leiras="A Starting célja, hogy a beléptetéstől az oktatáson át a napi státuszkezelésig egyetlen, könnyen kezelhető rendszerben dolgozhassanak a cégek."
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

      <section id="elonyok" className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SzakaszCim
            felirat="Előnyök"
            cim="Üzleti megjelenés, tiszta működés, stabil alapok"
            leiras="Az induló Starting felület már most reszponzív, gyors és könnyen bővíthető. A cél a professzionális vállalati használhatóság desktopon, tableten és mobilon is."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {elonyok.map((elony) => (
              <div key={elony.cim} className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-kartya backdrop-blur">
                <h3 className="text-xl font-semibold text-white">{elony.cim}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{elony.leiras}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-starting-primer/30 bg-gradient-to-r from-starting-primer/20 via-slate-900 to-sky-500/20 p-8 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-starting-primerVilagos">Készen az indulásra</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Építsük fel együtt a Starting vállalati rendszerét a stabil alapoktól.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
              A webes és mobilos alapverzió már elő van készítve ugyanahhoz a backend szemlélethez. A következő szakaszokban jön a routing,
              a Supabase kapcsolat, a hitelesítés és a moduláris üzleti funkciók beépítése.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:mt-0 lg:flex-col">
            <NavigaciosLink className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-slate-100" href="/belepes">
              Belépés előkészítve
            </NavigaciosLink>
            <a className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10" href="mailto:hello@starting.hu">
              Kapcsolati hely előkészítve
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-sm text-slate-400 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Starting. Digitális munkakezdés weben és mobilon.</p>
          <div className="flex flex-wrap gap-4">
            <NavigaciosLink className="transition hover:text-white" href="/adatkezeles">
              Adatkezelés
            </NavigaciosLink>
            <NavigaciosLink className="transition hover:text-white" href="/aszf">
              ÁSZF
            </NavigaciosLink>
            <a className="transition hover:text-white" href="https://starting.hu" target="_blank" rel="noreferrer">
              starting.hu
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
