// Ez a fájl az admin áttekintő dashboard összesített adattípusait írja le.
export type AdminKiemeltMutato = {
  azonosito: 'cegek' | 'dolgozok' | 'aktiv_jelenletek' | 'hianyzo_kotelezo_elemek';
  cim: string;
  ertek: number;
  valtozasLeiras: string;
  reszletek: string;
};

export type AdminRendszerAllapot = {
  id: string;
  cim: string;
  statusz: 'stabil' | 'figyelmeztetes' | 'kritikus';
  leiras: string;
  meta: string;
};

export type AdminUtolsoEsemeny = {
  id: string;
  cim: string;
  leiras: string;
  idobelyeg: string;
  kategoria: 'jelenlet' | 'oktatas' | 'dokumentum' | 'rendszer';
};

export type AdminDashboardAdat = {
  attekintoSzoveg: string;
  kiemeltMutatok: AdminKiemeltMutato[];
  hianyzoKotelezoTetelBontas: Array<{
    cim: string;
    darab: number;
    leiras: string;
  }>;
  utolsoEsemenyek: AdminUtolsoEsemeny[];
  rendszerAllapotok: AdminRendszerAllapot[];
};
