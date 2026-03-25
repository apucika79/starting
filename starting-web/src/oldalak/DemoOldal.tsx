import { useMemo, useState } from 'react';

import { MarkaJelveny } from '@/komponensek/MarkaJelveny';
import { NavigaciosLink } from '@/komponensek/NavigaciosLink';

type DemoLepes = {
  cim: string;
  leiras: string;
};

type DemoElem = {
  id: string;
  munkakor: string;
  dolgozoNev: string;
  statusz: 'Uj' | 'Folyamatban' | 'Megtekintve';
  lepesek: DemoLepes[];
};

const demoAdatok: DemoElem[] = [
  {
    id: 'onb-001',
    munkakor: 'Raktári betanulás',
    dolgozoNev: 'Kovács Eszter',
    statusz: 'Uj',
    lepesek: [
      { cim: 'Munkaterület bemutatása', leiras: 'Rövid ismertető a zónákról, útvonalakról és felelősségi pontokról.' },
      { cim: 'Biztonsági ellenőrző lista', leiras: 'Védőfelszerelés, kijáratok és napi ellenőrzési pontok áttekintése.' },
      { cim: 'Műszakindítás visszaigazolás', leiras: 'A dolgozó jóváhagyja, hogy megismerte a kezdési folyamatot.' },
    ],
  },
  {
    id: 'onb-002',
    munkakor: 'Élelmiszerbiztonsági oktatás',
    dolgozoNev: 'Szabó Márk',
    statusz: 'Folyamatban',
    lepesek: [
      { cim: 'Higiéniai alapelvek', leiras: 'Kézfertőtlenítés, felületkezelés és keresztszennyezés megelőzése.' },
      { cim: 'Hőmérséklet naplózás', leiras: 'Tárolási és átadási határértékek rövid áttekintése mintaadatokkal.' },
      { cim: 'Műszak végi lezárás', leiras: 'Napi záróellenőrzés és hibajegy indításának menete.' },
    ],
  },
  {
    id: 'onb-003',
    munkakor: 'Beléptetési protokoll',
    dolgozoNev: 'Tóth Zita',
    statusz: 'Uj',
    lepesek: [
      { cim: 'Belépési pontok', leiras: 'Főbejárat, vendég belépés és rendkívüli belépési útvonal rövid leírása.' },
      { cim: 'Azonosítás és jogosultság', leiras: 'Kártyahasználat, PIN megerősítés és szerepkör szerinti ellenőrzések.' },
      { cim: 'Napi indulás véglegesítése', leiras: 'Egyetlen kattintással jelezhető a modul megtekintése és elfogadása.' },
    ],
  },
];

const statuszSzin: Record<DemoElem['statusz'], string> = {
  Uj: 'border-sky-200 bg-sky-50 text-sky-700',
  Folyamatban: 'border-amber-200 bg-amber-50 text-amber-700',
  Megtekintve: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export function DemoOldal() {
  const [sorok, setSorok] = useState(demoAdatok);
  const [aktivElemId, setAktivElemId] = useState<string | null>(null);
  const [aktualisLepesIndex, setAktualisLepesIndex] = useState(0);

  const aktivElem = useMemo(() => sorok.find((sor) => sor.id === aktivElemId) ?? null, [aktivElemId, sorok]);
  const aktualisLepes = aktivElem?.lepesek[aktualisLepesIndex] ?? null;

  const kezeliMegnyitast = (id: string) => {
    setAktivElemId(id);
    setAktualisLepesIndex(0);

    setSorok((elozo) =>
      elozo.map((sor) => (sor.id === id && sor.statusz === 'Uj' ? { ...sor, statusz: 'Folyamatban' } : sor)),
    );
  };

  const bezarAblakot = () => {
    setAktivElemId(null);
    setAktualisLepesIndex(0);
  };

  const kezeliTovabb = () => {
    if (!aktivElem) {
      return;
    }

    const utolsoLepes = aktualisLepesIndex >= aktivElem.lepesek.length - 1;

    if (utolsoLepes) {
      setSorok((elozo) => elozo.map((sor) => (sor.id === aktivElem.id ? { ...sor, statusz: 'Megtekintve' } : sor)));
      bezarAblakot();
      return;
    }

    setAktualisLepesIndex((elozo) => elozo + 1);
  };

  return (
    <main className="min-h-screen bg-halo px-6 py-6 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-kartya backdrop-blur sm:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <MarkaJelveny />
          <div className="flex flex-wrap gap-3">
            <NavigaciosLink className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20" href="/">
              Főoldal
            </NavigaciosLink>
            <NavigaciosLink className="rounded-full bg-starting-primer px-4 py-2 text-sm font-semibold text-white transition hover:bg-starting-primerVilagos" href="/belepes">
              Belépés
            </NavigaciosLink>
          </div>
        </header>

        <section className="mt-8 rounded-[1.75rem] border border-starting-primer/20 bg-starting-primer/5 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-starting-primerVilagos">Kipróbálható nyitó demó</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Fiktív adatokkal tesztelhető onboarding és oktatás</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
            Videók helyett minden modul egy egyszerű ablakban nyílik meg. A tartalom végigléptethető a <strong>Tovább</strong> gombbal,
            így imitálható a megtekintés, és a státusz automatikusan <strong>Megtekintve</strong> értékre vált.
          </p>
        </section>

        <section className="mt-6 grid gap-4">
          {sorok.map((sor) => (
            <article key={sor.id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{sor.id}</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{sor.munkakor}</h2>
                  <p className="mt-2 text-sm text-slate-300">Dolgozó: {sor.dolgozoNev}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statuszSzin[sor.statusz]}`}>
                  {sor.statusz}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-300">{sor.lepesek.length} lépéses teszt folyamat • videó nélkül</p>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  onClick={() => kezeliMegnyitast(sor.id)}
                >
                  Ablak megnyitása
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>

      {aktivElem && aktualisLepes ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-starting-primerVilagos">{aktivElem.munkakor}</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{aktualisLepes.cim}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-200">{aktualisLepes.leiras}</p>
            <p className="mt-4 text-xs text-slate-400">
              Lépés {aktualisLepesIndex + 1}/{aktivElem.lepesek.length}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={bezarAblakot}
              >
                Bezárás
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-starting-primer px-5 py-2 text-sm font-semibold text-white transition hover:bg-starting-primerVilagos"
                onClick={kezeliTovabb}
              >
                Tovább
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
