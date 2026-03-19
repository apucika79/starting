// Ez a fájl a 11. admin felület áttekintő dashboard komponensét jeleníti meg.
import { useEffect, useMemo, useState } from 'react';

import { adminDashboardBetoltese } from '@/szolgaltatasok/admin';
import type { AdminDashboardAdat, AdminRendszerAllapot, AdminUtolsoEsemeny } from '@/tipusok/admin';

type AdminEsemenySzuro = 'osszes' | AdminUtolsoEsemeny['kategoria'];
type AdminStatuszSzuro = 'osszes' | AdminRendszerAllapot['statusz'];
type BetoltesiAllapot = 'betoltes' | 'siker' | 'hiba';
type ToastAllapot = {
  tipus: 'siker' | 'info';
  uzenet: string;
};

type AdminAttekintoDashboardTulajdonsagok = {
  lathato: boolean;
};

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

const szuroCimkek: Record<AdminEsemenySzuro, string> = {
  osszes: 'Összes esemény',
  jelenlet: 'Jelenlét',
  oktatas: 'Oktatás',
  dokumentum: 'Dokumentum',
  rendszer: 'Rendszer',
};

const statuszSzuroCimkek: Record<AdminStatuszSzuro, string> = {
  osszes: 'Minden állapot',
  stabil: 'Stabil',
  figyelmeztetes: 'Figyelmeztetés',
  kritikus: 'Kritikus',
};

function uresAllapotUzenet(esemenySzuro: AdminEsemenySzuro, statuszSzuro: AdminStatuszSzuro) {
  if (esemenySzuro !== 'osszes' && statuszSzuro !== 'osszes') {
    return `Nincs olyan sor, amely egyszerre ${szuroCimkek[esemenySzuro].toLowerCase()} és ${statuszSzuroCimkek[statuszSzuro].toLowerCase()} állapotú.`;
  }

  if (esemenySzuro !== 'osszes') {
    return `A kiválasztott szűrőre jelenleg nincs ${szuroCimkek[esemenySzuro].toLowerCase()} elem.`;
  }

  if (statuszSzuro !== 'osszes') {
    return `A kiválasztott szűrőre jelenleg nincs ${statuszSzuroCimkek[statuszSzuro].toLowerCase()} állapotú tétel.`;
  }

  return 'Jelenleg nincs megjeleníthető admin teendő a táblázatban.';
}

export function AdminAttekintoDashboard({ lathato }: AdminAttekintoDashboardTulajdonsagok) {
  const [allapot, setAllapot] = useState<BetoltesiAllapot>('betoltes');
  const [dashboard, setDashboard] = useState<AdminDashboardAdat | null>(null);
  const [kivalasztottEsemenySzuro, setKivalasztottEsemenySzuro] = useState<AdminEsemenySzuro>('osszes');
  const [kivalasztottStatuszSzuro, setKivalasztottStatuszSzuro] = useState<AdminStatuszSzuro>('osszes');
  const [kivalasztottEsemeny, setKivalasztottEsemeny] = useState<AdminUtolsoEsemeny | null>(null);
  const [toast, setToast] = useState<ToastAllapot | null>(null);

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

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutAzonosito = window.setTimeout(() => {
      setToast(null);
    }, 3200);

    return () => {
      window.clearTimeout(timeoutAzonosito);
    };
  }, [toast]);

  const szurtRendszerAllapotok = useMemo(
    () =>
      (dashboard?.rendszerAllapotok ?? []).filter((allapotKartya) =>
        kivalasztottStatuszSzuro === 'osszes' ? true : allapotKartya.statusz === kivalasztottStatuszSzuro,
      ),
    [dashboard?.rendszerAllapotok, kivalasztottStatuszSzuro],
  );

  const szurtEsemenyek = useMemo(
    () =>
      (dashboard?.utolsoEsemenyek ?? []).filter((esemeny) =>
        kivalasztottEsemenySzuro === 'osszes' ? true : esemeny.kategoria === kivalasztottEsemenySzuro,
      ),
    [dashboard?.utolsoEsemenyek, kivalasztottEsemenySzuro],
  );

  const teendoTablaSorok = useMemo(
    () =>
      szurtEsemenyek.filter((esemeny) => {
        if (kivalasztottStatuszSzuro === 'osszes') {
          return true;
        }

        if (kivalasztottStatuszSzuro === 'kritikus') {
          return esemeny.kategoria === 'dokumentum' || esemeny.kategoria === 'rendszer';
        }

        if (kivalasztottStatuszSzuro === 'figyelmeztetes') {
          return esemeny.kategoria === 'jelenlet' || esemeny.kategoria === 'oktatas';
        }

        return false;
      }),
    [kivalasztottStatuszSzuro, szurtEsemenyek],
  );

  if (!lathato) {
    return null;
  }

  return (
    <section className="relative rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
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

      {allapot === 'betoltes' ? (
        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-starting-primerVilagos">Loading állapot</p>
          <h3 className="mt-2 text-base font-semibold text-white">Admin modulok előkészítése folyamatban</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`betolto-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                <div className="mt-4 h-8 w-20 animate-pulse rounded-full bg-white/10" />
                <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-white/10" />
                <div className="mt-2 h-3 w-5/6 animate-pulse rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {allapot === 'hiba' ? (
        <div className="mt-6 rounded-[1.5rem] border border-rose-400/30 bg-rose-500/10 p-5 text-sm leading-7 text-rose-100">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-200">Hibaállapot</p>
          <h3 className="mt-2 text-base font-semibold text-white">Az admin dashboard most nem tölthető be</h3>
          <p className="mt-3">
            Ellenőrizd a mintaadatokat vagy a későbbi backend integrációt, majd próbáld meg újratölteni ezt a modult.
          </p>
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
          {szurtRendszerAllapotok.map((allapotKartya) => (
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

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
        <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Szűrők</p>
              <h3 className="mt-2 text-base font-semibold text-white">Operatív nézet szűrése</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">A táblázat és a rendszerállapot kártyák ugyanazokat a nézeti szűrőket használják.</p>
            </div>
            <button
              className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:bg-slate-900"
              onClick={() => {
                setKivalasztottEsemenySzuro('osszes');
                setKivalasztottStatuszSzuro('osszes');
                setToast({ tipus: 'info', uzenet: 'A dashboard szűrői alapállapotba kerültek.' });
              }}
              type="button"
            >
              Szűrők törlése
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm text-slate-200">
              <span>Eseménytípus</span>
              <select
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-starting-primer"
                onChange={(event) => {
                  setKivalasztottEsemenySzuro(event.target.value as AdminEsemenySzuro);
                }}
                value={kivalasztottEsemenySzuro}
              >
                {Object.entries(szuroCimkek).map(([ertek, cimke]) => (
                  <option key={ertek} value={ertek}>
                    {cimke}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-slate-200">
              <span>Prioritási állapot</span>
              <select
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-starting-primer"
                onChange={(event) => {
                  setKivalasztottStatuszSzuro(event.target.value as AdminStatuszSzuro);
                }}
                value={kivalasztottStatuszSzuro}
              >
                {Object.entries(statuszSzuroCimkek).map(([ertek, cimke]) => (
                  <option key={ertek} value={ertek}>
                    {cimke}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Aktív szűrés</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">{szuroCimkek[kivalasztottEsemenySzuro]}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">{statuszSzuroCimkek[kivalasztottStatuszSzuro]}</span>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Táblázat + műveletek</p>
              <h3 className="mt-2 text-base font-semibold text-white">Admin utánkövetési tábla</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">A lista a kártyákból és az eseményekből összeálló napi operatív teendőket mutatja.</p>
            </div>
            <button
              className="rounded-full bg-starting-primer px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-starting-primerVilagos"
              onClick={() => {
                setToast({ tipus: 'siker', uzenet: 'A napi admin összefoglaló exportja mintaként elindult.' });
              }}
              type="button"
            >
              Export indítása
            </button>
          </div>

          {teendoTablaSorok.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse bg-slate-950/60 text-left text-sm text-slate-200">
                  <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Tétel</th>
                      <th className="px-4 py-3 font-semibold">Típus</th>
                      <th className="px-4 py-3 font-semibold">Időbélyeg</th>
                      <th className="px-4 py-3 font-semibold">Művelet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teendoTablaSorok.map((sor, index) => (
                      <tr key={sor.id} className={index % 2 === 0 ? 'bg-white/[0.03]' : 'bg-transparent'}>
                        <td className="px-4 py-4 align-top">
                          <p className="font-semibold text-white">{sor.cim}</p>
                          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{sor.leiras}</p>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${esemenyKategoriaOsztalyok[sor.kategoria]}`}>
                            {esemenyKategoriaCimkek[sor.kategoria]}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-top text-slate-400">{sor.idobelyeg}</td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
                              onClick={() => {
                                setKivalasztottEsemeny(sor);
                              }}
                              type="button"
                            >
                              Részletek
                            </button>
                            <button
                              className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 transition hover:bg-emerald-500/20"
                              onClick={() => {
                                setToast({ tipus: 'siker', uzenet: `A(z) „${sor.cim}” tétel utánkövetése mintaként elindult.` });
                              }}
                              type="button"
                            >
                              Követés indítása
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.5rem] border border-dashed border-white/15 bg-slate-950/60 p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-starting-primerVilagos">Üres állapot</p>
              <h4 className="mt-3 text-lg font-semibold text-white">Nincs találat a jelenlegi szűrőkre</h4>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300">{uresAllapotUzenet(kivalasztottEsemenySzuro, kivalasztottStatuszSzuro)}</p>
            </div>
          )}
        </section>
      </div>

      {kivalasztottEsemeny ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-starting-primerVilagos">Modál részletek</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{kivalasztottEsemeny.cim}</h3>
              </div>
              <button
                aria-label="Modál bezárása"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={() => {
                  setKivalasztottEsemeny(null);
                }}
                type="button"
              >
                Bezárás
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Kategória</p>
                <p className="mt-2 text-sm font-semibold text-white">{esemenyKategoriaCimkek[kivalasztottEsemeny.kategoria]}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Időbélyeg</p>
                <p className="mt-2 text-sm font-semibold text-white">{kivalasztottEsemeny.idobelyeg}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Leírás</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">{kivalasztottEsemeny.leiras}</p>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={() => {
                  setKivalasztottEsemeny(null);
                }}
                type="button"
              >
                Mégse
              </button>
              <button
                className="rounded-full bg-starting-primer px-4 py-3 text-sm font-semibold text-white transition hover:bg-starting-primerVilagos"
                onClick={() => {
                  setToast({ tipus: 'siker', uzenet: `A részletes intézkedés megnyílt ehhez: ${kivalasztottEsemeny.cim}.` });
                  setKivalasztottEsemeny(null);
                }}
                type="button"
              >
                Intézkedés megnyitása
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50 max-w-sm rounded-[1.25rem] border border-white/10 bg-slate-950/95 p-4 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-starting-primerVilagos">Toast üzenet • {toast.tipus === 'siker' ? 'Siker' : 'Információ'}</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{toast.uzenet}</p>
        </div>
      ) : null}
    </section>
  );
}
