// Ez a fájl a Starting mobilalkalmazás képernyőválasztó és funkcionális képernyők közös típusalapjait tartalmazza.
export type MobilKepernyoAzonosito =
  | 'bejelentkezes'
  | 'fokepernyo'
  | 'profil'
  | 'napi-munkakezdes'
  | 'sajat-jelenletek'
  | 'kotelezo-oktatasok'
  | 'dokumentum-elfogadas'
  | 'ertesitesek'
  | 'beallitasok';

export type KepernyoAtekintoElem = {
  cim: string;
  ertek: string;
  leiras: string;
};

export type KepernyoTeendo = {
  cim: string;
  allapot: string;
};

export type FunkcionalisKepernyoTartalom = {
  azonosito: MobilKepernyoAzonosito;
  menuCim: string;
  szakaszSzam: string;
  cim: string;
  rovidLeiras: string;
  kiemeles: string;
  foMuvelet: string;
  masodlagosMuvelet: string;
  attekintoElemek: KepernyoAtekintoElem[];
  teendok: KepernyoTeendo[];
};
