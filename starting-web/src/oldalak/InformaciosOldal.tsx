// Ez a fájl egyszerű információs oldalakat jelenít meg a még előkészítés alatt álló jogi és tartalmi útvonalakhoz.
import { MarkaJelveny } from '@/komponensek/MarkaJelveny';

type InformaciosOldalTulajdonsagok = {
  felirat: string;
  cim: string;
  leiras: string;
};

export function InformaciosOldal({ felirat, cim, leiras }: InformaciosOldalTulajdonsagok) {
  return (
    <main className="min-h-screen bg-halo px-6 py-6 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 shadow-kartya backdrop-blur sm:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-6 text-sm text-slate-300">
          <MarkaJelveny />
          <a className="rounded-full px-4 py-2 transition hover:bg-white/10" href="/">
            Vissza a főoldalra
          </a>
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.35em] text-starting-primerVilagos">{felirat}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">{cim}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{leiras}</p>
      </div>
    </main>
  );
}
