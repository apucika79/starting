// Ez a fájl a mobil értesítési modul induló, bővíthető adatait adja vissza.
import type { MobilErtesitesSor } from '../tipusok/ertesites';

const mintaMobilErtesitesek: MobilErtesitesSor[] = [
  {
    id: 'mobil-rendszer',
    cim: 'Rendszerüzenet',
    leiras: 'In-app üzenetek helye karbantartásról, változásokról és rövid tájékoztatókról.',
    hangsuly: 'informacio',
    cimke: 'Alap csatorna',
    pushHelyFenntartva: true,
  },
  {
    id: 'mobil-oktatas',
    cim: 'Kötelező oktatás figyelmeztetés',
    leiras: 'Prioritásos figyelmeztetés új vagy lejárathoz közelítő kötelező anyagokhoz.',
    hangsuly: 'figyelmeztetes',
    cimke: 'Magas prioritás',
    pushHelyFenntartva: true,
  },
  {
    id: 'mobil-jelenlet',
    cim: 'Hiányzó napi belépés',
    leiras: 'Kritikus emlékeztető, ha a napi munkakezdés még nincs rögzítve.',
    hangsuly: 'kritikus',
    cimke: 'Jelenléti trigger',
    pushHelyFenntartva: true,
  },
  {
    id: 'mobil-admin',
    cim: 'Admin értesítési lista',
    leiras: 'Összesített admin nézet előkészítve külön listázási és szűrési logikához.',
    hangsuly: 'informacio',
    cimke: 'Lista alap',
    pushHelyFenntartva: false,
  },
];

export function mobilErtesitesekBetoltese() {
  return mintaMobilErtesitesek;
}
