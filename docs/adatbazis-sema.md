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
- dolgozo_dokumentumok
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



## Dolgozók kezelése

A `profilok`, `dolgozok`, `meghivok`, `dolgozo_dokumentumok` és `dokumentum_elfogadasok` együtt fedik le a dolgozói adminisztráció fő adatigényeit.

### Kezelt mezők és műveletek

- **név** – a `profilok.teljes_nev` mezőben tárolva
- **email** – a `profilok.email` mezőben, egyedi értékként
- **telefonszám** – a `profilok.telefonszam` mezőben
- **pozíció** – a `dolgozok.pozicio` mezőben
- **szerepkör** – a `profilok.szerepkor` mezőben
- **állapot** – a `profilok.statusz` és `dolgozok.statusz` mezőkben, aktiválás / tiltás támogatásával
- **cég** – a `profilok.ceg_id` és `dolgozok.ceg_id` kapcsolatokon keresztül
- **telephely** – a `profilok.telephely_id` és `dolgozok.telephely_id` mezőkben
- **terület** – a `profilok.terulet_id` és `dolgozok.terulet_id` mezőkben
- **profilkép** – a `dolgozok.profilkep_url` mezőben, javasolt `profil-kepek` storage buckettel
- **dokumentumok** – a dolgozóhoz feltöltött egyedi fájlok a `dolgozo_dokumentumok` táblában, a kötelező vállalati dokumentumok elfogadása pedig a `dokumentum_elfogadasok` táblában követhető
- **meghívás küldése** – a `meghivok` tábla rögzíti a kiküldött meghívás címzettjét, szerepkörét, szervezeti hozzárendeléseit és státuszát
- **aktiválás / tiltás** – a státuszmezők használatával a dolgozó rekordja inaktiválható anélkül, hogy a történeti adatok elvesznének

### Javasolt működési szabályok

- dolgozó létrehozásakor a meghívó már tartalmazza a cég, telephely, terület, szerepkör és opcionális pozíció előkészített adatait
- a meghívó állapota legyen egyértelműen követhető: függőben, elfogadva, lejárt vagy visszavonva
- inaktivált dolgozó ne tudjon új belépést kezdeményezni, de a korábbi jelenléti, oktatási és dokumentum-elfogadási adatok maradjanak elérhetők
- a dolgozóhoz feltöltött dokumentumoknál érdemes megkülönböztetni az admin által feltöltött belső fájlokat és a dolgozó által aláírt / feltöltött mellékleteket
- a profilkép és dokumentum feltöltések storage szabályai szervezeti szinten legyenek szűrhetők

## Telephelyek és területek kezelése

A `telephelyek` és `teruletek` táblák a szervezeti felépítés alapját adják, ezért az adminfelületen érdemes a következő működést támogatni:

- **telephely létrehozása és szerkesztése** – név, cím, kapcsolódó cég és státusz megadásával
- **terület létrehozása és szerkesztése** – minden terület egy konkrét telephelyhez tartozzon
- **dolgozók hozzárendelése** – a dolgozók egy kijelölt telephelyhez és opcionálisan területhez kapcsolhatók legyenek
- **vezetők hozzárendelése** – a területvezetők egy vagy több területhez rendelhetők legyenek, hogy a jogosultságok pontosan szűrhetők maradjanak
- **aktív / inaktív állapot kezelése** – telephely és terület szinten is legyen lehetőség státuszváltásra anélkül, hogy a korábbi adatok elvesznének

### Javasolt működési szabályok

- inaktiváláskor a meglévő historikus adatok maradjanak elérhetők riportálási és naplózási célból
- új dolgozó vagy vezető csak aktív telephelyhez és aktív területhez legyen hozzárendelhető
- terület csak a saját telephelyén belül legyen kiválasztható, hogy elkerülhető legyen a hibás kereszthozzárendelés
- a vezetői hozzárendeléseket érdemes külön kapcsolótáblával kezelni, ha egy vezető több területért is felelhet

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
