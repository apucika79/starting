// Ez a fájl a 11. admin felület áttekintő dashboard komponensét jeleníti meg.
import { useEffect, useState } from 'react';

import { adminDashboardBetoltese } from '@/szolgaltatasok/admin';
import type { AdminDashboardAdat, AdminRendszerAllapot, AdminUtolsoEsemeny } from '@/tipusok/admin';

const rendszerStatuszOsztalyok: Record<AdminRendszerAllapot['statusz'], string> = {
  stabil: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
  figyelmeztetes: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
  kritikus: 'border-rose-400/30 bg-rose-500/10 text-rose-100',
};

const rendszerStatuszCimkek: Record<AdminRendszerAllapot['statusz'], string> = {
  stabil: 'Stabil',
  figyelmeztetes: 'Figyelmeztetés',
  kritikus: 'Kritikus',
};

const esemenyKategoriaOsztalyok: Record<AdminUtolsoEsemeny['kategoria'], string> = {
  jelenlet: 'border-sky-400/30 bg-sky-500/10 text-sky-100',
  oktatas: 'border-violet-400/30 bg-violet-500/10 text-violet-100',
  dokumentum: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
  rendszer: 'border-slate-400/30 bg-slate-500/10 text-slate-100',
};

const esemenyKategoriaCimkek: Record<AdminUtolsoEsemeny['kategoria'], string> = {
  jelenlet: 'Jelenlét',
  oktatas: 'Oktatás',
  dokumentum: 'Dokumentum',
  rendszer: 'Rendszer',
};

type AdminAttekintoDashboardTulajdonsagok = {
  lathato: boolean;
};

type BetoltesiAllapot = 'betoltes' | 'siker' | 'hiba';

export function AdminAttekintoDashboard({ lathato }: AdminAttekintoDashboardTulajdonsagok) {
  const [allapot, setAllapot] = useState<BetoltesiAllapot>('betoltes');
  const [dashboard, setDashboard] = useState<AdminDashboardAdat | null>(null);

  useEffect(() => {
    if (!lathato) {
      return;
    }

    let aktiv = true;

    setAllapot('betoltes');

    void adminDashboardBetoltese()
      .then((adatok) => {
        if (!aktiv) {
          return;
        }

        setDashboard(adatok);
        setAllapot('siker');
      })
      .catch(() => {
        if (aktiv) {
          setAllapot('hiba');
        }
      });

    return () => {
      aktiv = false;
    };
  }, [lathato]);

  if (!lathato) {
    return null;
  }

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-starting-primerVilagos">11. admin felület</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Áttekintő dashboard az admin napi prioritásaihoz</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            {dashboard?.attekintoSzoveg ?? 'A dashboard betölti a legfontosabb szervezeti számokat, hiányosságokat, utolsó eseményeket és rendszerállapotokat.'}
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-starting-primer/30 bg-starting-primer/5 px-4 py-3 text-sm text-slate-300">
          Egy nézetből ellenőrizhető az admin napi operatív állapota.
        </div>
      </div>

      {allapot === 'hiba' ? (
        <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm leading-7 text-rose-100">
          Az admin dashboard most nem tölthető be. Ellenőrizd a mintaadatokat vagy a későbbi backend integrációt.
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(dashboard?.kiemeltMutatok ?? Array.from({ length: 4 })).map((mutato, index) => (
          <div key={mutato ? mutato.azonosito : `placeholder-${index}`} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{mutato?.cim ?? 'Betöltés alatt'}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{mutato ? mutato.ertek : '—'}</p>
            <p className="mt-2 text-sm font-medium text-starting-primerVilagos">{mutato?.valtozasLeiras ?? 'Adatok előkészítése folyamatban.'}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{mutato?.reszletek ?? 'A kártya a későbbi backend összesítések helyére készül.'}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Hiányzó kötelező elemek</p>
              <h3 className="mt-2 text-base font-semibold text-white">Utánkövetést igénylő tételek bontásban</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              {dashboard?.hianyzoKotelezoTetelBontas.reduce((osszeg, tetel) => osszeg + tetel.darab, 0) ?? 0} tétel
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {dashboard?.hianyzoKotelezoTetelBontas.map((tetel) => (
              <article key={tetel.cim} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-white">{tetel.cim}</h4>
                  <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-100">
                    {tetel.darab}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{tetel.leiras}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Utolsó események</p>
              <h3 className="mt-2 text-base font-semibold text-white">Legfrissebb jelenléti, oktatási és rendszeresemények</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              {dashboard?.utolsoEsemenyek.length ?? 0} esemény
            </span>
          </div>

          <ol className="mt-4 space-y-3">
            {dashboard?.utolsoEsemenyek.map((esemeny) => (
              <li key={esemeny.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${esemenyKategoriaOsztalyok[esemeny.kategoria]}`}>
                    {esemenyKategoriaCimkek[esemeny.kategoria]}
                  </span>
                  <span className="text-xs text-slate-400">{esemeny.idobelyeg}</span>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-white">{esemeny.cim}</h4>
                <p className="mt-2 text-sm leading-7 text-slate-300">{esemeny.leiras}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Rendszerállapot kártyák</p>
            <h3 className="mt-2 text-base font-semibold text-white">Modulonként kiemelt üzemi állapotok</h3>
          </div>
          <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
            {dashboard?.rendszerAllapotok.length ?? 0} modul
          </span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {dashboard?.rendszerAllapotok.map((allapotKartya) => (
            <article key={allapotKartya.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-white">{allapotKartya.cim}</h4>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${rendszerStatuszOsztalyok[allapotKartya.statusz]}`}>
                  {rendszerStatuszCimkek[allapotKartya.statusz]}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{allapotKartya.leiras}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">{allapotKartya.meta}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
