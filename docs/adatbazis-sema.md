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


## Események és jegyzőkönyvek kezelése

Az `esemenyek` tábla az adminisztratív, működési és dolgozóhoz kapcsolódó bejegyzések rögzítésére szolgál.

### Kezelt mezők és műveletek

- **esemény rögzítése** – minden bejegyzés külön rekordként jön létre az `esemenyek` táblában
- **rövid leírás** – a `rovid_leiras` mezőben tárolva
- **kategória** – a `kategoria` mezőben, szabadon definiálható csoportosítással
- **dátum** – az `esemeny_datum` mezőben, időbélyeggel együtt
- **csatolmány** – a `csatolmany_url` mező hivatkozik a feltöltött fájlra
- **kapcsolódó dolgozó** – a `dolgozo_id` mezővel kapcsolható egy konkrét dolgozóhoz
- **kapcsolódó terület** – a `terulet_id` mezővel kapcsolható szervezeti területhez
- **admin láthatóság** – az `admin_lathato` logikai mező szabályozza, hogy a bejegyzés csak admin körben legyen látható

### Javasolt működési szabályok

- az események kategóriái legyenek egységesen kezelhetők, hogy a riportok és szűrések konzisztensen működjenek
- az admin látható bejegyzések ne jelenjenek meg dolgozói felületen, még akkor sem, ha dolgozóhoz vannak rendelve
- a csatolmányok storage szabályai kövessék a cég- és jogosultsági határokat
- egy esemény opcionálisan kapcsolódhasson csak dolgozóhoz, csak területhez vagy mindkettőhöz, a működési folyamattól függően

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


## Értesítések alapstruktúrája

Az `ertesitesek` tábla most már nem csak egy egyszerű in-app üzenetlista, hanem a későbbi többcsatornás értesítési modul alapja.

### Kezelt értesítéstípusok

- **rendszerüzenetek** – általános rendszer- és működési tájékoztatások
- **kötelező oktatás figyelmeztetés** – új vagy lejáratközeli kötelező anyagokhoz kapcsolódó emlékeztetők
- **hiányzó napi belépés figyelmeztetés** – munkakezdési napló hiánya esetén küldhető sürgős jelzés
- **admin értesítési lista alap** – admin követési listába emelhető tételek egységes tárolása
- **push értesítés későbbi helye** – előkészített push mezők a későbbi mobilküldéshez

### Javasolt működési szabályok

- a `tipus`, `prioritas`, `allapot` és `cel` enum mezők segítsék a konzisztens lekérdezést és a stabil kliensoldali megjelenítést
- a `profil_id` maradjon opcionális azoknál az admin vagy szerepkör alapú értesítéseknél, amelyek még nem egyetlen felhasználóhoz kötődnek
- az `admin_listaban_megjelenik` mező különítse el az admin összesítő nézetet a dolgozói in-app listától
- a `forras_tipus` és `forras_azonosito` mezők tegyék visszakövethetővé, hogy egy figyelmeztetés oktatásból, jelenlétből vagy rendszereseményből származik-e
- a `metaadat` JSON mezőben lehessen később határidőt, badge számot, küldési szabályt vagy extra kliensoldali navigációs információt tárolni
- a `push_elokeszitve`, `push_token`, `push_elokeszitve_at` és `push_kuldve_at` mezők most még csak előkészítik a mobil push logikát, de később új tábla nélkül is ráépíthető rá az ütemezett küldés

### Hatékonysági megfontolások

- külön indexek készüljenek az állapot + létrehozási idő szerinti lekérdezésekhez, mert az olvasatlan és legfrissebb lista ezeket gyakran használja
- az admin lista saját indexet kapjon, hogy a napi admin összesítő nézet nagyobb adatmennyiségnél is gyors maradjon
- a típus + cél kombináció indexelése segíti az olyan háttérfolyamatokat, amelyek például csak a hiányzó napi belépés figyelmeztetéseket vagy csak az admin célcsoportú elemeket gyűjtik ki
