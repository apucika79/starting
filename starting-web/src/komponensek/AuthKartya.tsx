// Ez a fájl a Starting auth-előkészítő oldalainak közös űrlapkártyáját jeleníti meg.
import { MarkaJelveny } from '@/komponensek/MarkaJelveny';
import { alkalmazasKonfiguracio } from '@/segedek/konfiguracio';

type Mezo = {
  azonosito: string;
  cimke: string;
  tipus?: 'email' | 'password' | 'text';
  helyorzo: string;
  automatikusKitoltes?: string;
};

type AuthKartyaTulajdonsagok = {
  felirat: string;
  cim: string;
  leiras: string;
  gombSzoveg: string;
  labjegyzet: string;
  alsoLinkSzoveg: string;
  alsoLinkHref: string;
  alsoLinkCimke: string;
  mezok: Mezo[];
  kiemeltPontok: string[];
};

export function AuthKartya({
  felirat,
  cim,
  leiras,
  gombSzoveg,
  labjegyzet,
  alsoLinkSzoveg,
  alsoLinkHref,
  alsoLinkCimke,
  mezok,
  kiemeltPontok,
}: AuthKartyaTulajdonsagok) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <section>
        <MarkaJelveny />
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.35em] text-starting-primerVilagos">{felirat}</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
          {cim}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{leiras}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {kiemeltPontok.map((pont) => (
            <div key={pont} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-200 backdrop-blur">
              {pont}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-starting-primer/20 bg-starting-primer/10 p-5 text-sm leading-6 text-slate-200">
          Domain előkészítve: <span className="font-semibold text-white">{alkalmazasKonfiguracio.domain.replace('https://', '')}</span>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-kartya backdrop-blur sm:p-8">
        <form className="space-y-5">
          {mezok.map((mezo) => (
            <label key={mezo.azonosito} className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">{mezo.cimke}</span>
              <input
                id={mezo.azonosito}
                type={mezo.tipus ?? 'text'}
                placeholder={mezo.helyorzo}
                autoComplete={mezo.automatikusKitoltes}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-starting-primer/50 focus:bg-white/10"
              />
            </label>
          ))}

          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-full bg-starting-primer px-6 py-3.5 text-base font-semibold text-white transition hover:bg-starting-primerVilagos"
          >
            {gombSzoveg}
          </button>
        </form>

        <p className="mt-4 text-sm leading-6 text-slate-400">{labjegyzet}</p>
        <p className="mt-6 text-sm text-slate-300">
          {alsoLinkSzoveg}{' '}
          <a className="font-semibold text-starting-primerVilagos transition hover:text-white" href={alsoLinkHref}>
            {alsoLinkCimke}
          </a>
        </p>
      </section>
    </div>
  );
}
