// Ez a fájl a webes értesítési központ induló adatforrását adja vissza a későbbi Supabase-integráció helyén.
import type { Ertesites, ErtesitesiAttekintes } from '@/tipusok/ertesites';

const mintaErtesitesek: Ertesites[] = [
  {
    id: 'rendszer-01',
    cim: 'Rendszerüzenet: heti karbantartási ablak',
    uzenet: 'Szombaton 22:00 és 23:00 között rövid karbantartás várható. A belépési és admin felületek ezalatt korlátozottan működhetnek.',
    tipus: 'rendszeruzenet',
    prioritas: 'normal',
    csatorna: 'alkalmazason_belul',
    olvasott: false,
    letrehozva: '2026-03-19 08:15',
    akcioCimke: 'Részletek',
    akcioUrl: '/fiok',
    adminListabanMegjelenik: true,
    pushHelyFenntartva: true,
  },
  {
    id: 'oktatas-01',
    cim: 'Kötelező oktatás: tűzvédelmi frissítés',
    uzenet: 'Új kötelező oktatási anyag érkezett. A megtekintést és az elfogadást a kijelölt határidő előtt rögzíteni kell.',
    tipus: 'kotelezo_oktatas',
    prioritas: 'magas',
    csatorna: 'email',
    olvasott: false,
    letrehozva: '2026-03-18 14:40',
    akcioCimke: 'Oktatás megnyitása',
    akcioUrl: '/fiok',
    adminListabanMegjelenik: true,
    pushHelyFenntartva: true,
  },
  {
    id: 'jelenlet-01',
    cim: 'Hiányzó napi belépés figyelmeztetés',
    uzenet: 'A mai naphoz még nincs rögzített munkakezdés. Ha már megérkeztél, indítsd el a napi belépést, hogy a jelenléti napló pontos maradjon.',
    tipus: 'hianyzo_napi_belepes',
    prioritas: 'kritikus',
    csatorna: 'push_elokeszitve',
    olvasott: false,
    letrehozva: '2026-03-19 09:05',
    akcioCimke: 'Belépés rögzítése',
    akcioUrl: '/fiok',
    adminListabanMegjelenik: false,
    pushHelyFenntartva: true,
  },
  {
    id: 'admin-01',
    cim: 'Admin lista alap: napi összesítő',
    uzenet: 'Az admin értesítési lista készen áll a kötelező oktatások, a hiányzó belépések és a rendszerüzenetek közös nézetére.',
    tipus: 'admin_osszefoglalo',
    prioritas: 'normal',
    csatorna: 'alkalmazason_belul',
    olvasott: true,
    letrehozva: '2026-03-19 07:30',
    akcioCimke: 'Lista megtekintése',
    akcioUrl: '/fiok',
    adminListabanMegjelenik: true,
    pushHelyFenntartva: false,
  },
];

const prioritasSorrend: Record<Ertesites['prioritas'], number> = {
  kritikus: 0,
  magas: 1,
  normal: 2,
  alacsony: 3,
};

export async function ertesitesekBetoltese(): Promise<Ertesites[]> {
  return [...mintaErtesitesek].sort((elso, masodik) => {
    const prioritasKulonbseg = prioritasSorrend[elso.prioritas] - prioritasSorrend[masodik.prioritas];

    if (prioritasKulonbseg !== 0) {
      return prioritasKulonbseg;
    }

    return masodik.letrehozva.localeCompare(elso.letrehozva);
  });
}

export function ertesitesiAttekintesKeszitese(ertesitesek: Ertesites[]): ErtesitesiAttekintes {
  return ertesitesek.reduce<ErtesitesiAttekintes>(
    (eredmeny, ertesites) => ({
      osszesen: eredmeny.osszesen + 1,
      olvasatlan: eredmeny.olvasatlan + (ertesites.olvasott ? 0 : 1),
      kritikus: eredmeny.kritikus + (ertesites.prioritas === 'kritikus' ? 1 : 0),
      adminListas: eredmeny.adminListas + (ertesites.adminListabanMegjelenik ? 1 : 0),
    }),
    {
      osszesen: 0,
      olvasatlan: 0,
      kritikus: 0,
      adminListas: 0,
    },
  );
}
