<!-- Ez a fájl a Starting induló adatbázis-struktúráját foglalja össze Supabase használathoz. -->
# Adatbázis séma

## Induló táblák

- cegek
- telephelyek
- teruletek
- profilok
- dolgozok
- meghivok
- jelenleti_naplok
- napi_statuszok
- oktatasi_anyagok
- oktatasi_teljesitesek
- dokumentumok
- dokumentum_elfogadasok
- esemenyek
- ertesitesek
- rendszer_naplok

## Tervezési alapelvek

- UUID alapú elsődleges kulcsok
- `created_at` és `updated_at` időbélyegek
- szerepkör alapú hozzáférés
- későbbi többcéges bővítés támogatása
- soft delete mezők ott, ahol üzletileg indokolt

A részletes induló SQL fájlok a `docs/supabase` mappában találhatók.

## Cégek kezelése

A `cegek` tábla már elő van készítve a következő adatok tárolására:

- `nev` – kötelező cégnév
- `adoszam` – opcionális adószám mező, későbbi validációhoz és számlázási integrációhoz
- `kapcsolattarto_nev` – elsődleges kapcsolattartó neve
- `kapcsolattarto_email` – elsődleges kapcsolattartó email címe
- `telefon` – céges vagy kapcsolattartói telefonszám
- `cim` – székhely vagy levelezési cím
- `statusz` – aktív / inaktív / törölt állapot
- `logo_url` – feltöltött céges logó hivatkozása
- `elofizetesi_csomag` – jövőbeli csomagkezeléshez fenntartott mező

### Javasolt működési szabályok

- a `nev` maradjon kötelező, mert ez az elsődleges azonosító az admin felületeken
- az `adoszam` egyedi indexet kapjon, hogy ugyanaz a cég ne kerülhessen be többször eltérő néven
- a `kapcsolattarto_email` mezőt érdemes a későbbi admin meghívási folyamathoz használni
- a `logo_url` a `ceg-logok` storage buckethez illeszthető
- az `elofizetesi_csomag` jelenleg szabad szövegként van előkészítve, de később enumra vagy külön előfizetés táblára bontható
