// Ez a fájl az admin áttekintő dashboard mintaösszesítőit állítja elő a meglévő riport- és értesítési adatokból.
import { ertesitesekBetoltese } from '@/szolgaltatasok/ertesitesek';
import { riportAdatokBetoltese } from '@/szolgaltatasok/riportok';
import type { AdminDashboardAdat, AdminRendszerAllapot, AdminUtolsoEsemeny } from '@/tipusok/admin';

const rendszerAllapotSorrend: Record<AdminRendszerAllapot['statusz'], number> = {
  kritikus: 0,
  figyelmeztetes: 1,
  stabil: 2,
};

const esemenyKategoriaCimkek: Record<AdminUtolsoEsemeny['kategoria'], string> = {
  jelenlet: 'Jelenlét',
  oktatas: 'Oktatás',
  dokumentum: 'Dokumentum',
  rendszer: 'Rendszer',
};

function egyediDarabszam(ertekek: string[]) {
  return new Set(ertekek).size;
}

function datumIdobelyeggeAlakit(ertek: string) {
  const normalizalt = ertek.includes(' ') ? ertek.replace(' ', 'T') : `${ertek}T00:00:00`;
  return new Date(normalizalt).getTime();
}

function esemenyCimke(kategoria: AdminUtolsoEsemeny['kategoria']) {
  return esemenyKategoriaCimkek[kategoria];
}

function rendszerStatusz(statusz: AdminRendszerAllapot['statusz']) {
  return statusz;
}

export async function adminDashboardBetoltese(): Promise<AdminDashboardAdat> {
  const [riportok, ertesitesek] = await Promise.all([riportAdatokBetoltese(), ertesitesekBetoltese()]);

  const cegekSzama = egyediDarabszam(riportok.dolgozok.map((sor) => sor.cegId));
  const dolgozokSzama = riportok.dolgozok.length;
  const aktivJelenletekSzama = riportok.jelenlet.filter((sor) => ['Munkában', 'Késés'].includes(sor.statusz)).length;
  const hianyzoOktatasokSzama = riportok.dolgozok.reduce((osszeg, sor) => osszeg + Math.max(sor.kotelezoAnyagokSzama - sor.teljesitettAnyagokSzama, 0), 0);
  const hianyzoElfogadasokSzama = riportok.hianyzo_elfogadas.length;
  const kritikusRiasztasokSzama = ertesitesek.filter((ertesites) => ertesites.prioritas === 'kritikus').length;
  const hianyzoKotelezoElemekSzama = hianyzoOktatasokSzama + hianyzoElfogadasokSzama;

  const nyitottRendszeruzenetekSzama = ertesitesek.filter((ertesites) => !ertesites.olvasott && ertesites.tipus === 'rendszeruzenet').length;

  const utolsoEsemenyek: AdminUtolsoEsemeny[] = [
    ...ertesitesek.map((ertesites) => ({
      id: `ertesites-${ertesites.id}`,
      cim: ertesites.cim,
      leiras: `${esemenyCimke('rendszer')}: ${ertesites.uzenet}`,
      idobelyeg: ertesites.letrehozva,
      kategoria: 'rendszer' as const,
    })),
    ...riportok.jelenlet.map((sor) => ({
      id: `jelenlet-${sor.id}`,
      cim: `${sor.dolgozoNev} – ${sor.statusz}`,
      leiras: `${sor.cegNev}, ${sor.telephelyNev} • munkakezdés: ${sor.munkaKezdete}`,
      idobelyeg: sor.munkaKezdete,
      kategoria: 'jelenlet' as const,
    })),
    ...riportok.oktatas.map((sor) => ({
      id: `oktatas-${sor.id}`,
      cim: `${sor.dolgozoNev} – ${sor.oktatasiAnyagCim}`,
      leiras: `${sor.kotelezo ? 'Kötelező' : 'Ajánlott'} anyag • teljesítés: ${sor.teljesitesiArany}%`,
      idobelyeg: sor.datum,
      kategoria: 'oktatas' as const,
    })),
    ...riportok.hianyzo_elfogadas.map((sor) => ({
      id: `dokumentum-${sor.id}`,
      cim: `${sor.dolgozoNev} – ${sor.dokumentumCim}`,
      leiras: `${sor.prioritas} prioritás • esedékes: ${sor.esedekesDatum}`,
      idobelyeg: sor.datum,
      kategoria: 'dokumentum' as const,
    })),
  ]
    .sort((elso, masodik) => datumIdobelyeggeAlakit(masodik.idobelyeg) - datumIdobelyeggeAlakit(elso.idobelyeg))
    .slice(0, 6);

  const rendszerAllapotok = [
    {
      id: 'allapot-jelenlet',
      cim: 'Jelenléti követés',
      statusz: rendszerStatusz(aktivJelenletekSzama >= Math.ceil(riportok.jelenlet.length / 2) ? 'stabil' : 'figyelmeztetes'),
      leiras: `${aktivJelenletekSzama} aktív jelenlét látható a ${riportok.jelenlet.length} vizsgált bejegyzésből.`,
      meta: 'Forrás: jelenléti riport',
    },
    {
      id: 'allapot-kotelezo',
      cim: 'Kötelező elemek teljesítése',
      statusz: rendszerStatusz(hianyzoKotelezoElemekSzama === 0 ? 'stabil' : hianyzoKotelezoElemekSzama > 4 ? 'kritikus' : 'figyelmeztetes'),
      leiras: `${hianyzoKotelezoElemekSzama} nyitott kötelező oktatás vagy dokumentum-elfogadás igényel utánkövetést.`,
      meta: 'Forrás: dolgozói és elfogadási lista',
    },
    {
      id: 'allapot-rendszer',
      cim: 'Rendszerüzenetek és riasztások',
      statusz: rendszerStatusz(kritikusRiasztasokSzama > 0 ? 'kritikus' : nyitottRendszeruzenetekSzama > 0 ? 'figyelmeztetes' : 'stabil'),
      leiras: `${kritikusRiasztasokSzama} kritikus és ${nyitottRendszeruzenetekSzama} olvasatlan rendszerüzenet található.`,
      meta: 'Forrás: értesítési központ',
    },
    {
      id: 'allapot-szervezet',
      cim: 'Szervezeti lefedettség',
      statusz: rendszerStatusz(cegekSzama > 1 ? 'stabil' : 'figyelmeztetes'),
      leiras: `${cegekSzama} cég és ${egyediDarabszam(riportok.dolgozok.map((sor) => sor.telephelyId))} telephely jelenik meg a mintaadatokban.`,
      meta: 'Forrás: szervezeti listák',
    },
  ].sort((elso, masodik) => rendszerAllapotSorrend[elso.statusz] - rendszerAllapotSorrend[masodik.statusz]);

  return {
    attekintoSzoveg:
      'A dashboard egy képernyőn foglalja össze a cégek, dolgozók, jelenlétek, kötelező hiányosságok és legfrissebb események állapotát, hogy az admin gyorsan tudjon priorizálni.',
    kiemeltMutatok: [
      {
        azonosito: 'cegek',
        cim: 'Cégek száma',
        ertek: cegekSzama,
        valtozasLeiras: `${egyediDarabszam(riportok.dolgozok.map((sor) => sor.telephelyId))} telephely jelenleg lefedve`,
        reszletek: 'Egyedi cégek a dolgozói és riport adathalmazból.',
      },
      {
        azonosito: 'dolgozok',
        cim: 'Dolgozók száma',
        ertek: dolgozokSzama,
        valtozasLeiras: `${riportok.dolgozok.filter((sor) => sor.foglalkoztatasiStatusz === 'Aktív').length} aktív státuszban`,
        reszletek: 'Dolgozói törzslista összes rekordja.',
      },
      {
        azonosito: 'aktiv_jelenletek',
        cim: 'Aktív jelenlétek száma',
        ertek: aktivJelenletekSzama,
        valtozasLeiras: `${riportok.jelenlet.filter((sor) => sor.statusz === 'Késés').length} késés figyelendő`,
        reszletek: 'Munkában vagy késés státuszú jelenlétek.',
      },
      {
        azonosito: 'hianyzo_kotelezo_elemek',
        cim: 'Hiányzó kötelező elemek',
        ertek: hianyzoKotelezoElemekSzama,
        valtozasLeiras: `${hianyzoElfogadasokSzama} dokumentum-elfogadás hiányzik`,
        reszletek: 'Nyitott kötelező oktatások és hiányzó elfogadások összesítve.',
      },
    ],
    hianyzoKotelezoTetelBontas: [
      {
        cim: 'Elmaradt kötelező oktatások',
        darab: hianyzoOktatasokSzama,
        leiras: 'A dolgozói listában a kötelező és teljesített anyagok különbsége.',
      },
      {
        cim: 'Hiányzó dokumentum-elfogadások',
        darab: hianyzoElfogadasokSzama,
        leiras: 'Nyitott digitális elfogadások a dokumentumlistából.',
      },
      {
        cim: 'Kritikus admin riasztások',
        darab: kritikusRiasztasokSzama,
        leiras: 'Kiemelt prioritású értesítések, amelyek azonnali ellenőrzést igényelnek.',
      },
    ],
    utolsoEsemenyek,
    rendszerAllapotok,
  };
}
