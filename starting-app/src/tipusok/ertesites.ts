// Ez a fájl a mobil értesítési előnézet alap adattípusait tartalmazza.
export type MobilErtesitesSor = {
  id: string;
  cim: string;
  leiras: string;
  hangsuly: 'informacio' | 'figyelmeztetes' | 'kritikus';
  cimke: string;
  pushHelyFenntartva: boolean;
};
