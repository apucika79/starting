// Ez a fájl a Starting webes értesítési központjának alap adattípusait írja le.
export type ErtesitesTipus = 'rendszeruzenet' | 'kotelezo_oktatas' | 'hianyzo_napi_belepes' | 'admin_osszefoglalo';
export type ErtesitesPrioritas = 'alacsony' | 'normal' | 'magas' | 'kritikus';
export type ErtesitesCsatorna = 'alkalmazason_belul' | 'email' | 'push_elokeszitve';

export type Ertesites = {
  id: string;
  cim: string;
  uzenet: string;
  tipus: ErtesitesTipus;
  prioritas: ErtesitesPrioritas;
  csatorna: ErtesitesCsatorna;
  olvasott: boolean;
  letrehozva: string;
  akcioCimke?: string;
  akcioUrl?: string;
  adminListabanMegjelenik: boolean;
  pushHelyFenntartva: boolean;
};

export type ErtesitesiAttekintes = {
  osszesen: number;
  olvasatlan: number;
  kritikus: number;
  adminListas: number;
};
