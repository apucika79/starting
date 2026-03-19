// Ez a fájl a riport/lista központ mintaadatait és szűrési segédeit adja a későbbi backend integráció helyén.
import type {
  DolgozoiListaSor,
  HianyzoElfogadasSor,
  JelenletiRiportSor,
  OktatasiTeljesitesiSor,
  RiportAdattar,
  RiportAlapSor,
  RiportOsszesito,
  RiportSzurok,
  RiportTipus,
  SzervezetiEgyseg,
} from '@/tipusok/riport';

const szervezetiMintak: SzervezetiEgyseg[] = [
  {
    cegId: 'ceg-starting',
    cegNev: 'Starting Mintacég',
    telephelyId: 'telephely-budapest',
    telephelyNev: 'Budapest központ',
    teruletId: 'terulet-raktar',
    teruletNev: 'Raktár',
  },
  {
    cegId: 'ceg-starting',
    cegNev: 'Starting Mintacég',
    telephelyId: 'telephely-budapest',
    telephelyNev: 'Budapest központ',
    teruletId: 'terulet-iroda',
    teruletNev: 'Iroda',
  },
  {
    cegId: 'ceg-starting',
    cegNev: 'Starting Mintacég',
    telephelyId: 'telephely-gyor',
    telephelyNev: 'Győr üzem',
    teruletId: 'terulet-gyartas',
    teruletNev: 'Gyártás',
  },
  {
    cegId: 'ceg-partner',
    cegNev: 'Partner Logisztika Kft.',
    telephelyId: 'telephely-szekesfehervar',
    telephelyNev: 'Székesfehérvár depó',
    teruletId: 'terulet-kiszallitas',
    teruletNev: 'Kiszállítás',
  },
];

const jelenletiSorok: JelenletiRiportSor[] = [
  {
    id: 'jelenlet-1',
    datum: '2026-03-19',
    ...szervezetiMintak[0],
    dolgozoNev: 'Kovács Anna',
    statusz: 'Munkában',
    munkaKezdete: '2026-03-19 07:58',
    munkaVege: '2026-03-19 16:12',
    ledolgozottOrak: 8.2,
  },
  {
    id: 'jelenlet-2',
    datum: '2026-03-19',
    ...szervezetiMintak[1],
    dolgozoNev: 'Szabó Gergely',
    statusz: 'Késés',
    munkaKezdete: '2026-03-19 08:21',
    munkaVege: '2026-03-19 16:30',
    ledolgozottOrak: 7.9,
  },
  {
    id: 'jelenlet-3',
    datum: '2026-03-18',
    ...szervezetiMintak[2],
    dolgozoNev: 'Tóth Mária',
    statusz: 'Munkában',
    munkaKezdete: '2026-03-18 05:55',
    munkaVege: '2026-03-18 14:04',
    ledolgozottOrak: 8.1,
  },
  {
    id: 'jelenlet-4',
    datum: '2026-03-18',
    ...szervezetiMintak[3],
    dolgozoNev: 'Varga Levente',
    statusz: 'Hiányzás',
    munkaKezdete: '2026-03-18 00:00',
    munkaVege: null,
    ledolgozottOrak: 0,
  },
  {
    id: 'jelenlet-5',
    datum: '2026-03-17',
    ...szervezetiMintak[0],
    dolgozoNev: 'Nagy Dóra',
    statusz: 'Szabadság',
    munkaKezdete: '2026-03-17 00:00',
    munkaVege: null,
    ledolgozottOrak: 0,
  },
];

const dolgozoiSorok: DolgozoiListaSor[] = [
  {
    id: 'dolgozo-1',
    datum: '2026-03-12',
    ...szervezetiMintak[0],
    dolgozoNev: 'Kovács Anna',
    pozicio: 'Raktári operátor',
    szerepkor: 'Dolgozó',
    foglalkoztatasiStatusz: 'Aktív',
    kotelezoAnyagokSzama: 6,
    teljesitettAnyagokSzama: 6,
  },
  {
    id: 'dolgozo-2',
    datum: '2026-03-10',
    ...szervezetiMintak[1],
    dolgozoNev: 'Szabó Gergely',
    pozicio: 'Irodai koordinátor',
    szerepkor: 'Területvezető',
    foglalkoztatasiStatusz: 'Aktív',
    kotelezoAnyagokSzama: 8,
    teljesitettAnyagokSzama: 7,
  },
  {
    id: 'dolgozo-3',
    datum: '2026-03-08',
    ...szervezetiMintak[2],
    dolgozoNev: 'Tóth Mária',
    pozicio: 'Gépsor kezelő',
    szerepkor: 'Dolgozó',
    foglalkoztatasiStatusz: 'Beléptetés alatt',
    kotelezoAnyagokSzama: 5,
    teljesitettAnyagokSzama: 3,
  },
  {
    id: 'dolgozo-4',
    datum: '2026-03-05',
    ...szervezetiMintak[3],
    dolgozoNev: 'Varga Levente',
    pozicio: 'Flottairányító',
    szerepkor: 'Cégadmin',
    foglalkoztatasiStatusz: 'Aktív',
    kotelezoAnyagokSzama: 4,
    teljesitettAnyagokSzama: 4,
  },
];

const oktatasiSorok: OktatasiTeljesitesiSor[] = [
  {
    id: 'oktatas-1',
    datum: '2026-03-19',
    ...szervezetiMintak[0],
    dolgozoNev: 'Kovács Anna',
    oktatasiAnyagCim: 'Tűzvédelmi alapok 2026',
    kotelezo: true,
    megtekintve: true,
    elfogadva: true,
    hatarido: '2026-03-25',
    teljesitesiArany: 100,
  },
  {
    id: 'oktatas-2',
    datum: '2026-03-19',
    ...szervezetiMintak[1],
    dolgozoNev: 'Szabó Gergely',
    oktatasiAnyagCim: 'Adatkezelési frissítő tréning',
    kotelezo: true,
    megtekintve: true,
    elfogadva: false,
    hatarido: '2026-03-22',
    teljesitesiArany: 80,
  },
  {
    id: 'oktatas-3',
    datum: '2026-03-18',
    ...szervezetiMintak[2],
    dolgozoNev: 'Tóth Mária',
    oktatasiAnyagCim: 'Munkavédelmi belépő csomag',
    kotelezo: true,
    megtekintve: false,
    elfogadva: false,
    hatarido: '2026-03-21',
    teljesitesiArany: 25,
  },
  {
    id: 'oktatas-4',
    datum: '2026-03-16',
    ...szervezetiMintak[3],
    dolgozoNev: 'Varga Levente',
    oktatasiAnyagCim: 'Sofőr indulási protokoll',
    kotelezo: false,
    megtekintve: true,
    elfogadva: true,
    hatarido: '2026-03-28',
    teljesitesiArany: 100,
  },
];

const hianyzoElfogadasSorok: HianyzoElfogadasSor[] = [
  {
    id: 'elfogadas-1',
    datum: '2026-03-19',
    ...szervezetiMintak[1],
    dolgozoNev: 'Szabó Gergely',
    dokumentumCim: 'Adatkezelési tájékoztató v2.1',
    esedekesDatum: '2026-03-22',
    prioritas: 'Magas',
    allapot: 'Folyamatban',
  },
  {
    id: 'elfogadas-2',
    datum: '2026-03-18',
    ...szervezetiMintak[2],
    dolgozoNev: 'Tóth Mária',
    dokumentumCim: 'Munkavédelmi szabályzat 2026',
    esedekesDatum: '2026-03-20',
    prioritas: 'Kritikus',
    allapot: 'Hiányzik',
  },
  {
    id: 'elfogadas-3',
    datum: '2026-03-17',
    ...szervezetiMintak[3],
    dolgozoNev: 'Varga Levente',
    dokumentumCim: 'Flottahasználati nyilatkozat',
    esedekesDatum: '2026-03-24',
    prioritas: 'Normál',
    allapot: 'Folyamatban',
  },
];

const riportLeirasok: Record<RiportTipus, Pick<RiportOsszesito, 'cim' | 'leiras'>> = {
  jelenlet: {
    cim: 'Jelenléti lista',
    leiras: 'Napi munkakezdések és jelenléti státuszok dátum, cég, telephely és terület szerint szűrve.',
  },
  dolgozok: {
    cim: 'Dolgozói lista',
    leiras: 'Szervezeti bontású dolgozói törzslista a beléptetési és oktatási állapotokkal együtt.',
  },
  oktatas: {
    cim: 'Oktatási teljesítési lista',
    leiras: 'Kötelező és ajánlott anyagok teljesítési állapota, megtekintés és elfogadás követéssel.',
  },
  hianyzo_elfogadas: {
    cim: 'Hiányzó elfogadások listája',
    leiras: 'Azon dolgozók és dokumentumok listája, ahol még nincs végleges digitális elfogadás.',
  },
};

export async function riportAdatokBetoltese(): Promise<RiportAdattar> {
  return {
    jelenlet: jelenletiSorok,
    dolgozok: dolgozoiSorok,
    oktatas: oktatasiSorok,
    hianyzo_elfogadas: hianyzoElfogadasSorok,
  };
}

export function riportOsszesitokKeszitese(adattar: RiportAdattar): RiportOsszesito[] {
  return (Object.keys(riportLeirasok) as RiportTipus[]).map((tipus) => ({
    tipus,
    cim: riportLeirasok[tipus].cim,
    leiras: riportLeirasok[tipus].leiras,
    elemszam: adattar[tipus].length,
  }));
}

export function szervezetiOpcioKeszletKeszitese(sorok: readonly RiportAlapSor[]) {
  const cegek = egyediOpcioListaKeszitese(sorok, 'cegId', 'cegNev');
  const telephelyek = egyediOpcioListaKeszitese(sorok, 'telephelyId', 'telephelyNev');
  const teruletek = egyediOpcioListaKeszitese(sorok, 'teruletId', 'teruletNev');

  return { cegek, telephelyek, teruletek };
}

export function szurtRiportSorok(sorok: RiportAdattar[RiportTipus], szurok: RiportSzurok): RiportAdattar[RiportTipus] {
  return sorok.filter((sor) => {
    if (szurok.datumTol && sor.datum < szurok.datumTol) {
      return false;
    }

    if (szurok.datumIg && sor.datum > szurok.datumIg) {
      return false;
    }

    if (szurok.cegId && sor.cegId !== szurok.cegId) {
      return false;
    }

    if (szurok.telephelyId && sor.telephelyId !== szurok.telephelyId) {
      return false;
    }

    if (szurok.teruletId && sor.teruletId !== szurok.teruletId) {
      return false;
    }

    return true;
  }) as RiportAdattar[RiportTipus];
}

function egyediOpcioListaKeszitese<T extends RiportAlapSor, I extends keyof T, N extends keyof T>(sorok: readonly T[], idKulcs: I, nevKulcs: N) {
  return Array.from(
    sorok.reduce((gyujto, sor) => {
      gyujto.set(String(sor[idKulcs]), String(sor[nevKulcs]));
      return gyujto;
    }, new Map<string, string>()),
  ).map(([id, nev]) => ({ id, nev }));
}
