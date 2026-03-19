import type { Session } from '@supabase/supabase-js';

import { MarkaJelveny } from '@/komponensek/MarkaJelveny';
import { NavigaciosLink } from '@/komponensek/NavigaciosLink';
import { kilepes } from '@/szolgaltatasok/auth';
import { navigalj } from '@/segedek/navigacio';

type VedettModulOldalTulajdonsagok = {
  felirat: string;
  cim: string;
  leiras: string;
  aktivUtvonal: string;
  session: Session;
};

type VedettNavigaciosPont = {
  href: string;
  cimke: string;
};

const vedettNavigacio: VedettNavigaciosPont[] = [
  { href: '/vezerlopult', cimke: 'Vezérlőpult' },
  { href: '/profil', cimke: 'Profil' },
  { href: '/cegek', cimke: 'Cégek' },
  { href: '/telephelyek', cimke: 'Telephelyek' },
  { href: '/teruletek', cimke: 'Területek' },
  { href: '/dolgozok', cimke: 'Dolgozók' },
  { href: '/jelenlet', cimke: 'Jelenlét' },
  { href: '/oktatasok', cimke: 'Oktatások' },
  { href: '/dokumentumok', cimke: 'Dokumentumok' },
  { href: '/ertesitesek', cimke: 'Értesítések' },
  { href: '/esemenyek', cimke: 'Események' },
  { href: '/beallitasok', cimke: 'Beállítások' },
  { href: '/admin', cimke: 'Admin' },
];

const kozosPontok = [
  'A route már védett, ezért csak aktív munkamenettel érhető el.',
  'A vizuális rendszer, a navigáció és a márkahasználat egységes a landing, auth és belső nézetek között.',
  'A modulhely készen áll arra, hogy a következő iterációban valódi adatbetöltést, szűrést és szerepkör-alapú funkciókat kapjon.',
];

export function VedettModulOldal({ felirat, cim, leiras, aktivUtvonal, session }: VedettModulOldalTulajdonsagok) {
  const email = session.user.email ?? 'ismeretlen@starting.hu';

  const kezeliKilepest = async () => {
    await kilepes();
    navigalj('/belepes', { replace: true });
  };

  return (
    <main className="min-h-screen bg-halo px-6 py-6 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-kartya backdrop-blur sm:p-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <MarkaJelveny />
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-[0.3em] text-starting-primerVilagos">Aktív munkamenet</p>
              <p className="mt-2 font-medium text-white">{email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <NavigaciosLink
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
              href="/"
            >
              Nyilvános főoldal
            </NavigaciosLink>
            <button
              className="inline-flex items-center justify-center rounded-full bg-starting-primer px-4 py-2 text-sm font-semibold text-white transition hover:bg-starting-primerVilagos"
              onClick={() => {
                void kezeliKilepest();
              }}
              type="button"
            >
              Kilépés
            </button>
          </div>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.35em] text-starting-primerVilagos">Védett oldalak</p>
            <nav className="mt-4 grid gap-2">
              {vedettNavigacio.map((pont) => {
                const aktiv = pont.href === aktivUtvonal;

                return (
                  <NavigaciosLink
                    key={pont.href}
                    className={[
                      'rounded-2xl px-4 py-3 text-sm font-medium transition',
                      aktiv ? 'bg-starting-primer text-white shadow-lg shadow-starting-primer/20' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white',
                    ].join(' ')}
                    href={pont.href}
                  >
                    {pont.cimke}
                  </NavigaciosLink>
                );
              })}
            </nav>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[1.75rem] border border-starting-primer/20 bg-gradient-to-br from-starting-primer/15 via-slate-950/80 to-sky-500/10 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-starting-primerVilagos">{felirat}</p>
              <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl">{cim}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">{leiras}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <NavigaciosLink
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  href="/vezerlopult"
                >
                  Vissza a vezérlőpultra
                </NavigaciosLink>
                <NavigaciosLink
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  href="/profil"
                >
                  Profil és hozzáférés
                </NavigaciosLink>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {kozosPontok.map((pont, index) => (
                <article key={pont} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">0{index + 1}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-200">{pont}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
