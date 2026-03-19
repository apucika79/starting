// Ez a fájl a belépés utáni fiókoldalon megjelenített profil- és szervezeti adatstruktúrákat írja le.
export type FelhasznaloiSzerepkor = 'szuperadmin' | 'ceg_admin' | 'terulet_vezeto' | 'dolgozo';
export type AltalanosStatusz = 'aktiv' | 'inaktiv' | 'torolt';

export type ProfilAdat = {
  id: string;
  teljes_nev: string;
  email: string;
  telefonszam: string | null;
  szerepkor: FelhasznaloiSzerepkor;
  statusz: AltalanosStatusz;
  ceg: {
    id: string;
    nev: string;
    domain: string | null;
  } | null;
  telephely: {
    id: string;
    nev: string;
    cim: string | null;
  } | null;
  terulet: {
    id: string;
    nev: string;
  } | null;
};
