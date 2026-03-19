// Ez a fájl egységes kártyakomponenst biztosít a Starting marketing és termékblokkjaihoz.
import type { PropsWithChildren } from 'react';

type TartalomKartyaTulajdonsagok = PropsWithChildren<{
  cim: string;
  leiras: string;
}>;

export function TartalomKartya({ cim, leiras, children }: TartalomKartyaTulajdonsagok) {
  return (
    <article className="rounded-3xl border border-starting-keret/70 bg-white p-7 shadow-kartya transition duration-300 hover:-translate-y-1 hover:border-starting-primer/30 hover:shadow-xl">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-starting-primer/10 text-starting-primer">
        {children}
      </div>
      <h3 className="text-xl font-semibold text-starting-sotet">{cim}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{leiras}</p>
    </article>
  );
}
