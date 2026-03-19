// Ez a fájl a riport/lista központ típusait írja le a webes admin felülethez.
export type RiportTipus = 'jelenlet' | 'dolgozok' | 'oktatas' | 'hianyzo_elfogadas';

export type SzervezetiEgyseg = {
  cegId: string;
  cegNev: string;
  telephelyId: string;
  telephelyNev: string;
  teruletId: string;
  teruletNev: string;
};

export type RiportSzurok = {
  datumTol: string;
  datumIg: string;
  cegId: string;
  telephelyId: string;
  teruletId: string;
};

export type RiportOsszesito = {
  tipus: RiportTipus;
  cim: string;
  leiras: string;
  elemszam: number;
};

export type RiportAlapSor = SzervezetiEgyseg & {
  id: string;
  datum: string;
};

export type JelenletiRiportSor = RiportAlapSor & {
  dolgozoNev: string;
  statusz: 'Munkában' | 'Késés' | 'Szabadság' | 'Hiányzás';
  munkaKezdete: string;
  munkaVege: string | null;
  ledolgozottOrak: number;
};

export type DolgozoiListaSor = RiportAlapSor & {
  dolgozoNev: string;
  pozicio: string;
  szerepkor: 'Dolgozó' | 'Területvezető' | 'Cégadmin';
  foglalkoztatasiStatusz: 'Aktív' | 'Beléptetés alatt' | 'Inaktív';
  kotelezoAnyagokSzama: number;
  teljesitettAnyagokSzama: number;
};

export type OktatasiTeljesitesiSor = RiportAlapSor & {
  dolgozoNev: string;
  oktatasiAnyagCim: string;
  kotelezo: boolean;
  megtekintve: boolean;
  elfogadva: boolean;
  hatarido: string;
  teljesitesiArany: number;
};

export type HianyzoElfogadasSor = RiportAlapSor & {
  dolgozoNev: string;
  dokumentumCim: string;
  esedekesDatum: string;
  prioritas: 'Normál' | 'Magas' | 'Kritikus';
  allapot: 'Hiányzik' | 'Folyamatban';
};

export type RiportAdattar = {
  jelenlet: JelenletiRiportSor[];
  dolgozok: DolgozoiListaSor[];
  oktatas: OktatasiTeljesitesiSor[];
  hianyzo_elfogadas: HianyzoElfogadasSor[];
};
