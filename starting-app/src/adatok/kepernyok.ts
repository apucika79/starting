// Ez a fájl a Starting mobilalkalmazás demó képernyőihez tartozó tartalmi adatokat gyűjti egy helyre.
import type { FunkcionalisKepernyoTartalom, MobilKepernyoAzonosito } from '../tipusok/kepernyok';

export const mobilKepernyoSorrend: MobilKepernyoAzonosito[] = [
  'bejelentkezes',
  'fokepernyo',
  'profil',
  'napi-munkakezdes',
  'sajat-jelenletek',
  'kotelezo-oktatasok',
  'dokumentum-elfogadas',
  'ertesitesek',
  'beallitasok',
];

export const funkcionalisKepernyok: Record<
  Exclude<MobilKepernyoAzonosito, 'bejelentkezes' | 'fokepernyo' | 'ertesitesek'>,
  FunkcionalisKepernyoTartalom
> = {
  profil: {
    azonosito: 'profil',
    menuCim: 'Saját profil',
    szakaszSzam: '3. képernyő',
    cim: 'Dolgozói profil és jogosultsági áttekintés',
    rovidLeiras: 'Személyes adatok, munkakör, telephely és aktív hozzáférések egy képernyőn.',
    kiemeles: 'A profilkártya a HR törzsadatokkal és a munkakezdési jogosultságokkal szinkronizálható.',
    foMuvelet: 'Profil szerkesztése',
    masodlagosMuvelet: 'Jogosultságok megtekintése',
    attekintoElemek: [
      { cim: 'Azonosítás', ertek: 'SSO + PIN', leiras: 'Gyors újraazonosítás mobilról.' },
      { cim: 'Telephely', ertek: '2 aktív hely', leiras: 'Munkahelyenként eltérő jogosultságokkal.' },
      { cim: 'Dokumentumok', ertek: 'Minden rendben', leiras: 'Nincs lejárt személyes irat.' },
    ],
    teendok: [
      { cim: 'Profilfotó frissítése', allapot: 'Opcionális' },
      { cim: 'Vészhelyzeti kontakt ellenőrzése', allapot: 'Ajánlott' },
      { cim: 'Munkakör-jóváhagyás', allapot: 'Szinkronizált' },
    ],
  },
  'napi-munkakezdes': {
    azonosito: 'napi-munkakezdes',
    menuCim: 'Napi munkakezdés',
    szakaszSzam: '4. képernyő',
    cim: 'Gyors napi jelenlétindítás ellenőrzési lépésekkel',
    rovidLeiras: 'Műszakkezdés, telephely, védőeszköz és rövid állapotjelzés egyetlen folyamatban.',
    kiemeles: 'Az indítás összehangolható geolokációval, beléptető ponttal és napi feladatkörrel.',
    foMuvelet: 'Munkakezdés rögzítése',
    masodlagosMuvelet: 'Mai állapot megnyitása',
    attekintoElemek: [
      { cim: 'Indítás ideje', ertek: '06:55', leiras: 'Tervezett műszakkezdés előtti belépés.' },
      { cim: 'Státusz', ertek: 'Munkára kész', leiras: 'Minden kötelező ellenőrzés teljesítve.' },
      { cim: 'Biztonság', ertek: '4/4 pont', leiras: 'Napi checklista jóváhagyva.' },
    ],
    teendok: [
      { cim: 'Védőfelszerelés visszaigazolása', allapot: 'Kötelező' },
      { cim: 'Telephely ellenőrzése', allapot: 'Automatikus' },
      { cim: 'Rövid egészségi állapot nyilatkozat', allapot: 'Kitöltendő' },
    ],
  },
  'sajat-jelenletek': {
    azonosito: 'sajat-jelenletek',
    menuCim: 'Saját jelenlétek',
    szakaszSzam: '5. képernyő',
    cim: 'Napi, heti és havi jelenlétek átlátható listában',
    rovidLeiras: 'Munkaidő, szünetek, késések, kimaradások és megjegyzések külön bontásban.',
    kiemeles: 'A listanézet exportálható és HR/admin ellenőrzéshez is előkészíthető.',
    foMuvelet: 'Jelenléti napló megnyitása',
    masodlagosMuvelet: 'Eltérés jelzése',
    attekintoElemek: [
      { cim: 'E heti napok', ertek: '4 rögzítve', leiras: 'A pénteki belépés még nyitott.' },
      { cim: 'Túlóra', ertek: '+2 óra', leiras: 'A rendszer külön jelöléssel mutatja.' },
      { cim: 'Hiányzás', ertek: '0 nap', leiras: 'Nincs tisztázatlan esemény.' },
    ],
    teendok: [
      { cim: 'Csütörtöki műszak jóváhagyása', allapot: 'Folyamatban' },
      { cim: 'Márciusi összesítő letöltése', allapot: 'Elérhető' },
      { cim: 'Eltérés megjegyzés rögzítése', allapot: 'Szükség esetén' },
    ],
  },
  'kotelezo-oktatasok': {
    azonosito: 'kotelezo-oktatasok',
    menuCim: 'Kötelező oktatások',
    szakaszSzam: '6. képernyő',
    cim: 'Képzések, vizsgák és lejárati figyelmeztetések kezelése',
    rovidLeiras: 'Minden kötelező oktatási modul egy helyen, státusszal és határidőkkel.',
    kiemeles: 'A képernyő támogatja a videós, dokumentumos és rövid tesztes tananyagokat is.',
    foMuvelet: 'Oktatások megnyitása',
    masodlagosMuvelet: 'Lejáratok szűrése',
    attekintoElemek: [
      { cim: 'Aktív képzések', ertek: '3 db', leiras: 'Ebből 1 sürgős lejáratközeli.' },
      { cim: 'Előrehaladás', ertek: '78%', leiras: 'Folyamatban lévő modulok együtt.' },
      { cim: 'Tanúsítványok', ertek: '12 archivált', leiras: 'Visszakereshető történettel.' },
    ],
    teendok: [
      { cim: 'Tűzvédelmi oktatás lezárása', allapot: 'Ma esedékes' },
      { cim: 'Rövid záróteszt kitöltése', allapot: 'Kötelező' },
      { cim: 'Tanúsítvány letöltése', allapot: 'Lezárás után' },
    ],
  },
  'dokumentum-elfogadas': {
    azonosito: 'dokumentum-elfogadas',
    menuCim: 'Dokumentum elfogadás',
    szakaszSzam: '7. képernyő',
    cim: 'Szabályzatok, nyilatkozatok és verziókövetett elfogadások',
    rovidLeiras: 'A felhasználó látja, mely dokumentumokat kell elolvasnia és digitálisan elfogadnia.',
    kiemeles: 'A rendszer naplózza a verziót, időpontot és az elfogadás módját is.',
    foMuvelet: 'Dokumentum megnyitása',
    masodlagosMuvelet: 'Elfogadási napló',
    attekintoElemek: [
      { cim: 'Új dokumentum', ertek: '2 db', leiras: 'Frissített adatkezelési és belépési szabályzat.' },
      { cim: 'Elfogadva', ertek: '18 verzió', leiras: 'Teljes visszakereshetőséggel.' },
      { cim: 'Határidő', ertek: '48 óra', leiras: 'Kiemelt szabályzat esetén rövidebb SLA.' },
    ],
    teendok: [
      { cim: 'Adatkezelési tájékoztató elfogadása', allapot: 'Kötelező' },
      { cim: 'Új belépési rend megtekintése', allapot: 'Olvasandó' },
      { cim: 'Elfogadási időbélyeg mentése', allapot: 'Automatikus' },
    ],
  },
  beallitasok: {
    azonosito: 'beallitasok',
    menuCim: 'Beállítások',
    szakaszSzam: '9. képernyő',
    cim: 'Személyre szabott alkalmazás- és értesítési preferenciák',
    rovidLeiras: 'Téma, nyelv, biometrikus belépés, push értesítés és adatvédelmi opciók.',
    kiemeles: 'A beállítások több eszköz között is szinkronizálhatók, ha a felhasználó engedélyezi.',
    foMuvelet: 'Preferenciák mentése',
    masodlagosMuvelet: 'Értesítési csatornák',
    attekintoElemek: [
      { cim: 'Biztonság', ertek: 'Face ID aktív', leiras: 'Gyorsabb és biztonságosabb belépéshez.' },
      { cim: 'Nyelv', ertek: 'Magyar', leiras: 'Később többnyelvű bővítéssel.' },
      { cim: 'Push', ertek: '3 csatorna', leiras: 'Külön munkaidő, oktatás és rendszerüzenet.' },
    ],
    teendok: [
      { cim: 'Munkaidő emlékeztető finomhangolása', allapot: 'Ajánlott' },
      { cim: 'Biometrikus azonosítás ellenőrzése', allapot: 'Aktív' },
      { cim: 'Adatvédelmi beállítások áttekintése', allapot: 'Negyedéves' },
    ],
  },
};
