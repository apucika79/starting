// Ez a fájl a Starting auth-előkészítő oldalainak közös űrlapkártyáját jeleníti meg.
import type { ChangeEvent, FormEvent } from 'react';

import { MarkaJelveny } from '@/komponensek/MarkaJelveny';
import { NavigaciosLink } from '@/komponensek/NavigaciosLink';
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
  ertekek?: Record<string, string>;
  betoltes?: boolean;
  hibaUzenet?: string;
  sikerUzenet?: string;
  extraMuveletSzoveg?: string;
  extraMuveletCimke?: string;
  onExtraMuvelet?: () => void;
  onMezoValtozas?: (azonosito: string, ertek: string) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
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
  ertekek = {},
  betoltes = false,
  hibaUzenet,
  sikerUzenet,
  extraMuveletSzoveg,
  extraMuveletCimke,
  onExtraMuvelet,
  onMezoValtozas,
  onSubmit,
}: AuthKartyaTulajdonsagok) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <section>
        <MarkaJelveny />
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.35em] text-starting-primerVilagos">{felirat}</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">{cim}</h1>
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
        <form className="space-y-5" onSubmit={onSubmit}>
          {hibaUzenet ? (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100">{hibaUzenet}</div>
          ) : null}

          {sikerUzenet ? (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-100">{sikerUzenet}</div>
          ) : null}

          {mezok.map((mezo) => (
            <label key={mezo.azonosito} className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">{mezo.cimke}</span>
              <input
                id={mezo.azonosito}
                type={mezo.tipus ?? 'text'}
                placeholder={mezo.helyorzo}
                autoComplete={mezo.automatikusKitoltes}
                value={ertekek[mezo.azonosito] ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onMezoValtozas?.(mezo.azonosito, event.target.value);
                }}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-starting-primer/50 focus:bg-white/10"
              />
            </label>
          ))}

          <button
            type="submit"
            disabled={betoltes}
            className="inline-flex w-full items-center justify-center rounded-full bg-starting-primer px-6 py-3.5 text-base font-semibold text-white transition hover:bg-starting-primerVilagos disabled:cursor-not-allowed disabled:opacity-70"
          >
            {betoltes ? 'Feldolgozás...' : gombSzoveg}
          </button>
        </form>

        <p className="mt-4 text-sm leading-6 text-slate-400">{labjegyzet}</p>

        {extraMuveletSzoveg && extraMuveletCimke && onExtraMuvelet ? (
          <p className="mt-4 text-sm text-slate-300">
            {extraMuveletSzoveg}{' '}
            <button
              type="button"
              onClick={onExtraMuvelet}
              className="font-semibold text-starting-primerVilagos transition hover:text-white"
            >
              {extraMuveletCimke}
            </button>
          </p>
        ) : null}

        <p className="mt-6 text-sm text-slate-300">
          {alsoLinkSzoveg}{' '}
          <NavigaciosLink className="font-semibold text-starting-primerVilagos transition hover:text-white" href={alsoLinkHref}>
            {alsoLinkCimke}
          </NavigaciosLink>
        </p>
      </section>
    </div>
  );
}
