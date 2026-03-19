// Ez a fájl a riport/lista/szűrés központ felületét jeleníti meg a webes admin oldalon.
import { useEffect, useMemo, useState } from 'react';

import {
  riportAdatokBetoltese,
  riportOsszesitokKeszitese,
  szervezetiOpcioKeszletKeszitese,
  szurtRiportSorok,
} from '@/szolgaltatasok/riportok';
import type {
  DolgozoiListaSor,
  HianyzoElfogadasSor,
  JelenletiRiportSor,
  OktatasiTeljesitesiSor,
  RiportAdattar,
  RiportSzurok,
  RiportTipus,
} from '@/tipusok/riport';

const riportTabCimkek: Record<RiportTipus, string> = {
  jelenlet: 'Jelenléti lista',
  dolgozok: 'Dolgozói lista',
  oktatas: 'Oktatási teljesítési lista',
  hianyzo_elfogadas: 'Hiányzó elfogadások',
};

const uresSzurok: RiportSzurok = {
  datumTol: '',
  datumIg: '',
  cegId: '',
  telephelyId: '',
  teruletId: '',
};

const badgeAlapOsztaly = 'inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em]';

function cimkeOsztaly(statusz: string) {
  if (['Munkában', 'Aktív', 'Elfogadva', 'Teljesítve'].includes(statusz)) {
    return `${badgeAlapOsztaly} border-emerald-400/30 bg-emerald-500/10 text-emerald-200`;
  }

  if (['Késés', 'Beléptetés alatt', 'Folyamatban', 'Megtekintve'].includes(statusz)) {
    return `${badgeAlapOsztaly} border-amber-400/30 bg-amber-500/10 text-amber-100`;
  }

  if (['Hiányzás', 'Hiányzik', 'Kritikus', 'Inaktív'].includes(statusz)) {
    return `${badgeAlapOsztaly} border-rose-400/30 bg-rose-500/10 text-rose-100`;
  }

  return `${badgeAlapOsztaly} border-sky-400/30 bg-sky-500/10 text-sky-100`;
}

function aranySzin(arany: number) {
  if (arany >= 100) {
    return 'bg-emerald-400';
  }

  if (arany >= 60) {
    return 'bg-amber-400';
  }

  return 'bg-rose-400';
}

export function RiportKozpont() {
  const [riportok, setRiportok] = useState<RiportAdattar | null>(null);
  const [aktivRiport, setAktivRiport] = useState<RiportTipus>('jelenlet');
  const [szurok, setSzurok] = useState<RiportSzurok>(uresSzurok);

  useEffect(() => {
    let aktiv = true;

    void riportAdatokBetoltese().then((adatok) => {
      if (aktiv) {
        setRiportok(adatok);
      }
    });

    return () => {
      aktiv = false;
    };
  }, []);

  const aktivSorok = useMemo(() => {
    if (!riportok) {
      return [];
    }

    return riportok[aktivRiport];
  }, [aktivRiport, riportok]);

  const szurtSorok = useMemo(() => szurtRiportSorok(aktivSorok, szurok), [aktivSorok, szurok]);
  const osszesitok = useMemo(() => (riportok ? riportOsszesitokKeszitese(riportok) : []), [riportok]);
  const opciok = useMemo(() => szervezetiOpcioKeszletKeszitese(aktivSorok), [aktivSorok]);

  useEffect(() => {
    if (szurok.cegId && !aktivSorok.some((sor) => sor.cegId === szurok.cegId)) {
      setSzurok((elozo) => ({ ...elozo, cegId: '', telephelyId: '', teruletId: '' }));
      return;
    }

    if (szurok.telephelyId && !aktivSorok.some((sor) => sor.telephelyId === szurok.telephelyId)) {
      setSzurok((elozo) => ({ ...elozo, telephelyId: '', teruletId: '' }));
      return;
    }

    if (szurok.teruletId && !aktivSorok.some((sor) => sor.teruletId === szurok.teruletId)) {
      setSzurok((elozo) => ({ ...elozo, teruletId: '' }));
    }
  }, [aktivSorok, szurok.cegId, szurok.telephelyId, szurok.teruletId]);

  const szurtTelephelyek = useMemo(
    () => opciok.telephelyek.filter((telephely) => !szurok.cegId || aktivSorok.some((sor) => sor.cegId === szurok.cegId && sor.telephelyId === telephely.id)),
    [aktivSorok, opciok.telephelyek, szurok.cegId],
  );

  const szurtTeruletek = useMemo(
    () =>
      opciok.teruletek.filter(
        (terulet) =>
          (!szurok.cegId || aktivSorok.some((sor) => sor.cegId === szurok.cegId && sor.teruletId === terulet.id)) &&
          (!szurok.telephelyId || aktivSorok.some((sor) => sor.telephelyId === szurok.telephelyId && sor.teruletId === terulet.id)),
      ),
    [aktivSorok, opciok.teruletek, szurok.cegId, szurok.telephelyId],
  );

  const kezeliSzuroValtozast = (kulcs: keyof RiportSzurok, ertek: string) => {
    setSzurok((elozo) => {
      if (kulcs === 'cegId') {
        return { ...elozo, cegId: ertek, telephelyId: '', teruletId: '' };
      }

      if (kulcs === 'telephelyId') {
        return { ...elozo, telephelyId: ertek, teruletId: '' };
      }

      return { ...elozo, [kulcs]: ertek };
    });
  };

  const exportFajlnev = `${aktivRiport}-${szurok.datumTol || 'kezdet'}-${szurok.datumIg || 'veg'}`;

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-starting-primerVilagos">10. riportok / listák / szűrések</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Riportközpont jelenléti, dolgozói, oktatási és elfogadási listákkal</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Az admin felület egy közös riportmodulban kezeli a jelenléti listát, a dolgozói törzslistát, az oktatási teljesítéseket és a hiányzó
            elfogadásokat. Minden lista ugyanazt a dátum, cég, telephely és terület szerinti szűrési logikát használja.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-starting-primer/30 bg-starting-primer/5 px-4 py-3 text-sm text-slate-300">
          Export helye előkészítve a későbbi backend és fájltároló integrációhoz.
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        {osszesitok.map((osszefoglalo) => (
          <button
            key={osszefoglalo.tipus}
            type="button"
            onClick={() => setAktivRiport(osszefoglalo.tipus)}
            className={`rounded-[1.5rem] border p-4 text-left transition ${
              aktivRiport === osszefoglalo.tipus ? 'border-starting-primer/40 bg-starting-primer/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-starting-primerVilagos">{osszefoglalo.elemszam} elem</p>
            <h3 className="mt-3 text-base font-semibold text-white">{osszefoglalo.cim}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{osszefoglalo.leiras}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Aktív nézet</p>
            <h3 className="mt-2 text-base font-semibold text-white">{riportTabCimkek[aktivRiport]}</h3>
          </div>
          <button
            type="button"
            onClick={() => setSzurok(uresSzurok)}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Szűrők törlése
          </button>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Dátum tól</span>
            <input
              type="date"
              value={szurok.datumTol}
              onChange={(event) => kezeliSzuroValtozast('datumTol', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-starting-primer"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Dátum ig</span>
            <input
              type="date"
              value={szurok.datumIg}
              onChange={(event) => kezeliSzuroValtozast('datumIg', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-starting-primer"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Cég</span>
            <select
              value={szurok.cegId}
              onChange={(event) => kezeliSzuroValtozast('cegId', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-starting-primer"
            >
              <option value="">Összes cég</option>
              {opciok.cegek.map((ceg) => (
                <option key={ceg.id} value={ceg.id}>
                  {ceg.nev}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Telephely</span>
            <select
              value={szurok.telephelyId}
              onChange={(event) => kezeliSzuroValtozast('telephelyId', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-starting-primer"
            >
              <option value="">Összes telephely</option>
              {szurtTelephelyek.map((telephely) => (
                <option key={telephely.id} value={telephely.id}>
                  {telephely.nev}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Terület</span>
            <select
              value={szurok.teruletId}
              onChange={(event) => kezeliSzuroValtozast('teruletId', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-starting-primer"
            >
              <option value="">Összes terület</option>
              {szurtTeruletek.map((terulet) => (
                <option key={terulet.id} value={terulet.id}>
                  {terulet.nev}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-white">Szűrt eredmények</h3>
              <p className="mt-1 text-sm text-slate-400">{szurtSorok.length} találat az aktív riportban.</p>
            </div>
            <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              {riportTabCimkek[aktivRiport]}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-[0.25em] text-slate-400">
                {renderFejlec(aktivRiport)}
              </thead>
              <tbody>
                {renderTorzs(aktivRiport, szurtSorok)}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <h3 className="text-base font-semibold text-white">Szűrési összegzés</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <li>• Dátumtartomány: {szurok.datumTol || 'nincs megadva'} – {szurok.datumIg || 'nincs megadva'}</li>
              <li>• Cégszűrő: {keresettNev(opciok.cegek, szurok.cegId, 'Összes cég')}</li>
              <li>• Telephelyszűrő: {keresettNev(szurtTelephelyek, szurok.telephelyId, 'Összes telephely')}</li>
              <li>• Területszűrő: {keresettNev(szurtTeruletek, szurok.teruletId, 'Összes terület')}</li>
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <h3 className="text-base font-semibold text-white">Export előkészítés</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Az exportlogika helye kijelölve: a szűrt lista fájlnévvel, rekordszámmal és riporttípussal készen áll a későbbi CSV, XLSX vagy PDF generáláshoz.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button type="button" disabled className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-slate-400">
                CSV
              </button>
              <button type="button" disabled className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-slate-400">
                XLSX
              </button>
              <button type="button" disabled className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-slate-400">
                PDF
              </button>
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-starting-primer/30 bg-starting-primer/5 p-4 text-sm leading-7 text-slate-300">
              Előkészített export kulcs: <span className="font-semibold text-white">{exportFajlnev}</span>
              <br />
              Rekordszám: <span className="font-semibold text-white">{szurtSorok.length}</span>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <h3 className="text-base font-semibold text-white">Gyors ellenőrző mutatók</h3>
            <div className="mt-4 space-y-3">
              {renderMutatok(aktivRiport, szurtSorok)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderFejlec(aktivRiport: RiportTipus) {
  const kozosOsztaly = 'px-5 py-3';

  if (aktivRiport === 'jelenlet') {
    return (
      <tr>
        <th className={kozosOsztaly}>Dátum</th>
        <th className={kozosOsztaly}>Dolgozó</th>
        <th className={kozosOsztaly}>Szervezeti hely</th>
        <th className={kozosOsztaly}>Státusz</th>
        <th className={kozosOsztaly}>Munkaidő</th>
      </tr>
    );
  }

  if (aktivRiport === 'dolgozok') {
    return (
      <tr>
        <th className={kozosOsztaly}>Belépési dátum</th>
        <th className={kozosOsztaly}>Dolgozó</th>
        <th className={kozosOsztaly}>Pozíció / szerepkör</th>
        <th className={kozosOsztaly}>Szervezeti hely</th>
        <th className={kozosOsztaly}>Teljesítés</th>
      </tr>
    );
  }

  if (aktivRiport === 'oktatas') {
    return (
      <tr>
        <th className={kozosOsztaly}>Dátum</th>
        <th className={kozosOsztaly}>Dolgozó</th>
        <th className={kozosOsztaly}>Anyag</th>
        <th className={kozosOsztaly}>Állapot</th>
        <th className={kozosOsztaly}>Határidő</th>
      </tr>
    );
  }

  return (
    <tr>
      <th className={kozosOsztaly}>Dátum</th>
      <th className={kozosOsztaly}>Dolgozó</th>
      <th className={kozosOsztaly}>Dokumentum</th>
      <th className={kozosOsztaly}>Szervezeti hely</th>
      <th className={kozosOsztaly}>Prioritás</th>
    </tr>
  );
}

function renderTorzs(aktivRiport: RiportTipus, szurtSorok: RiportAdattar[RiportTipus]) {
  if (szurtSorok.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">
          Nincs találat a megadott szűrőkkel.
        </td>
      </tr>
    );
  }

  if (aktivRiport === 'jelenlet') {
    return (szurtSorok as JelenletiRiportSor[]).map((sor) => (
      <tr key={sor.id} className="border-t border-white/10 align-top text-slate-200">
        <td className="px-5 py-4">{sor.datum}</td>
        <td className="px-5 py-4 font-semibold text-white">{sor.dolgozoNev}</td>
        <td className="px-5 py-4 text-slate-300">{sor.cegNev} / {sor.telephelyNev} / {sor.teruletNev}</td>
        <td className="px-5 py-4"><span className={cimkeOsztaly(sor.statusz)}>{sor.statusz}</span></td>
        <td className="px-5 py-4 text-slate-300">{sor.munkaKezdete} – {sor.munkaVege ?? 'nyitott'}<br />{sor.ledolgozottOrak.toFixed(1)} óra</td>
      </tr>
    ));
  }

  if (aktivRiport === 'dolgozok') {
    return (szurtSorok as DolgozoiListaSor[]).map((sor) => (
      <tr key={sor.id} className="border-t border-white/10 align-top text-slate-200">
        <td className="px-5 py-4">{sor.datum}</td>
        <td className="px-5 py-4 font-semibold text-white">{sor.dolgozoNev}</td>
        <td className="px-5 py-4 text-slate-300">{sor.pozicio}<br /><span className="text-xs text-slate-400">{sor.szerepkor}</span></td>
        <td className="px-5 py-4 text-slate-300">{sor.cegNev} / {sor.telephelyNev} / {sor.teruletNev}<br /><span className={cimkeOsztaly(sor.foglalkoztatasiStatusz)}>{sor.foglalkoztatasiStatusz}</span></td>
        <td className="px-5 py-4 text-slate-300">{sor.teljesitettAnyagokSzama}/{sor.kotelezoAnyagokSzama} kötelező anyag</td>
      </tr>
    ));
  }

  if (aktivRiport === 'oktatas') {
    return (szurtSorok as OktatasiTeljesitesiSor[]).map((sor) => (
      <tr key={sor.id} className="border-t border-white/10 align-top text-slate-200">
        <td className="px-5 py-4">{sor.datum}</td>
        <td className="px-5 py-4 font-semibold text-white">{sor.dolgozoNev}</td>
        <td className="px-5 py-4 text-slate-300">{sor.oktatasiAnyagCim}<br /><span className="text-xs text-slate-400">{sor.kotelezo ? 'Kötelező anyag' : 'Ajánlott anyag'}</span></td>
        <td className="px-5 py-4 text-slate-300">
          <div className="flex flex-col gap-2">
            <span className={cimkeOsztaly(sor.elfogadva ? 'Elfogadva' : sor.megtekintve ? 'Megtekintve' : 'Hiányzik')}>
              {sor.elfogadva ? 'Elfogadva' : sor.megtekintve ? 'Megtekintve' : 'Hiányzik'}
            </span>
            <div className="h-2 rounded-full bg-slate-800">
              <div className={`h-2 rounded-full ${aranySzin(sor.teljesitesiArany)}`} style={{ width: `${sor.teljesitesiArany}%` }} />
            </div>
            <span className="text-xs text-slate-400">Teljesítés: {sor.teljesitesiArany}%</span>
          </div>
        </td>
        <td className="px-5 py-4 text-slate-300">{sor.hatarido}</td>
      </tr>
    ));
  }

  return (szurtSorok as HianyzoElfogadasSor[]).map((sor) => (
    <tr key={sor.id} className="border-t border-white/10 align-top text-slate-200">
      <td className="px-5 py-4">{sor.datum}</td>
      <td className="px-5 py-4 font-semibold text-white">{sor.dolgozoNev}</td>
      <td className="px-5 py-4 text-slate-300">{sor.dokumentumCim}<br /><span className="text-xs text-slate-400">Esedékes: {sor.esedekesDatum}</span></td>
      <td className="px-5 py-4 text-slate-300">{sor.cegNev} / {sor.telephelyNev} / {sor.teruletNev}<br /><span className={cimkeOsztaly(sor.allapot)}>{sor.allapot}</span></td>
      <td className="px-5 py-4"><span className={cimkeOsztaly(sor.prioritas)}>{sor.prioritas}</span></td>
    </tr>
  ));
}

function renderMutatok(aktivRiport: RiportTipus, szurtSorok: RiportAdattar[RiportTipus]) {
  if (aktivRiport === 'jelenlet') {
    const sorok = szurtSorok as JelenletiRiportSor[];
    const aktiv = sorok.filter((sor) => sor.statusz === 'Munkában').length;
    const elteres = sorok.filter((sor) => ['Késés', 'Hiányzás'].includes(sor.statusz)).length;

    return [
      <div key="aktiv" className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">Aktív műszakban: <span className="font-semibold text-white">{aktiv}</span></div>,
      <div key="elteres" className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">Eltéréses jelenlétek: <span className="font-semibold text-white">{elteres}</span></div>,
    ];
  }

  if (aktivRiport === 'dolgozok') {
    const sorok = szurtSorok as DolgozoiListaSor[];
    const aktiv = sorok.filter((sor) => sor.foglalkoztatasiStatusz === 'Aktív').length;
    const belptetes = sorok.filter((sor) => sor.foglalkoztatasiStatusz === 'Beléptetés alatt').length;

    return [
      <div key="aktiv" className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">Aktív dolgozók: <span className="font-semibold text-white">{aktiv}</span></div>,
      <div key="belptetes" className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">Beléptetés alatt: <span className="font-semibold text-white">{belptetes}</span></div>,
    ];
  }

  if (aktivRiport === 'oktatas') {
    const sorok = szurtSorok as OktatasiTeljesitesiSor[];
    const elfogadott = sorok.filter((sor) => sor.elfogadva).length;
    const hataridonBelul = sorok.filter((sor) => !sor.elfogadva).length;

    return [
      <div key="elfogadott" className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">Elfogadott anyagok: <span className="font-semibold text-white">{elfogadott}</span></div>,
      <div key="nyitott" className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">Nyitott teljesítések: <span className="font-semibold text-white">{hataridonBelul}</span></div>,
    ];
  }

  const sorok = szurtSorok as HianyzoElfogadasSor[];
  const kritikus = sorok.filter((sor) => sor.prioritas === 'Kritikus').length;
  const hianyzik = sorok.filter((sor) => sor.allapot === 'Hiányzik').length;

  return [
    <div key="kritikus" className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">Kritikus elfogadások: <span className="font-semibold text-white">{kritikus}</span></div>,
    <div key="hianyzik" className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">Teljesen hiányzó elfogadások: <span className="font-semibold text-white">{hianyzik}</span></div>,
  ];
}

function keresettNev(opciok: { id: string; nev: string }[], azonosito: string, alapertelmezett: string) {
  return opciok.find((opcio) => opcio.id === azonosito)?.nev ?? alapertelmezett;
}
