// Ez a fájl egységes kártyakomponenst biztosít a Starting marketing és termékblokkjaihoz.
import type { PropsWithChildren } from 'react';

type TartalomKartyaTulajdonsagok = PropsWithChildren<{
  cim: string;
  leiras: string;
}>;

export function TartalomKartya({ cim, leiras, children }: TartalomKartyaTulajdonsagok) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-kartya backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-starting-primer/40 hover:bg-white/10">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-starting-primer/20 text-starting-primerVilagos">
        {children}
      </div>
      <h3 className="text-xl font-semibold text-white">{cim}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{leiras}</p>
    </article>
  );
}
