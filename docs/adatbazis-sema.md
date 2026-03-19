<!-- Ez a fájl a Starting induló adatbázis-struktúráját foglalja össze Supabase használathoz. -->
# Adatbázis séma

## Kötelező alap táblák

Az aktuális Supabase terv tartalmazza a kért alap táblákat:

- `cegek`
- `telephelyek`
- `teruletek`
- `profilok`
- `dolgozok`
- `meghivok`
- `jelenleti_naplok`
- `napi_statuszok`
- `oktatasi_anyagok`
- `oktatasi_teljesitesek`
- `dokumentumok`
- `dokumentum_elfogadasok`
- `esemenyek`
- `ertesitesek`
- `rendszer_naplok`

## Kiegészítő, a jelenlegi kódokhoz hasznos táblák

A jelenlegi üzleti folyamatok és a már dokumentált admin működés miatt a sémában szerepel még egy plusz kapcsolódó tábla is:

- `dolgozo_dokumentumok` – dolgozókhoz feltöltött egyedi igazolások, mellékletek és admin dokumentumok tárolására

Ez nem helyettesíti a `dokumentumok` táblát, hanem kiegészíti azt:

- a `dokumentumok` a vállalati, sablon jellegű vagy kötelező dokumentumokat kezeli
- a `dokumentum_elfogadasok` ezek elfogadását követi felhasználónként
- a `dolgozo_dokumentumok` a konkrét dolgozóhoz tartozó egyedi feltöltéseket tárolja

## Tervezési alapelvek

- UUID alapú elsődleges kulcsok
- egységes `letrehozva` és `frissitve` mezők ott, ahol szerkeszthető rekordokról van szó
- szerepkör alapú hozzáférés Supabase RLS-sel
- többcéges működés támogatása már az induló struktúrában
- soft delete mezők ott, ahol üzletileg indokolt
- riportokhoz, oktatási követéshez és dokumentum-elfogadásokhoz szükséges extra mezők előkészítése

A részletes SQL fájlok a `docs/supabase` mappában találhatók:

- `docs/supabase/schema.sql`
- `docs/supabase/rls.sql`
- `docs/supabase/seed.sql`

## Főbb összehangolások a jelenlegi kódbázissal

### Szervezeti hierarchia

A webes felület több helyen cég → telephely → terület bontásban dolgozik, ezért ez a hierarchia első osztályú része a sémának.

- `cegek`
- `telephelyek.ceg_id`
- `teruletek.telephely_id`
- `profilok`, `dolgozok`, `jelenleti_naplok`, `oktatasi_anyagok`, `dokumentumok`, `esemenyek`, `ertesitesek` ezekhez kapcsolhatók

### Beléptetés és meghívásos regisztráció

A jelenlegi auth folyamat meghívó tokennel induló regisztrációt feltételez, ezért a sémában ez külön támogatást kap.

- a `meghivok` tábla tárolja a szervezeti hozzárendeléseket, szerepkört és lejáratot
- az `ervenyes_meghivo_ellenorzese` SQL függvény ugyanazt a minimális adatcsomagot adja vissza, amit a webes kliens most is használ
- a `profil_letrehozasa_meghivobol` trigger az `auth.users` rekord létrejöttekor automatikusan létrehozza vagy frissíti a `profilok` és `dolgozok` rekordokat

### Profil és dolgozó adatok

A `profilok`, `dolgozok`, `meghivok`, `dolgozo_dokumentumok` és `dokumentum_elfogadasok` együtt fedik le a dolgozói adminisztráció fő adatigényeit.

#### Kezelt mezők és műveletek

- **név** – a `profilok.teljes_nev` mezőben tárolva
- **email** – a `profilok.email` mezőben, egyedi értékként
- **telefonszám** – a `profilok.telefonszam` mezőben
- **pozíció** – a `dolgozok.pozicio` és a `meghivok.pozicio` mezőkben
- **szerepkör** – a `profilok.szerepkor` mezőben
- **általános állapot** – a `profilok.statusz` és `dolgozok.statusz` mezőkben
- **foglalkoztatási állapot** – a `dolgozok.foglalkoztatasi_statusz` mezőben, ami a riportokban is hasznos bontást ad
- **cég / telephely / terület** – a szervezeti kapcsolatok minden fontos dolgozói rekordban külön is tárolhatók a gyorsabb szűréshez
- **profilkép** – a `dolgozok.profilkep_url` mezőben, javasolt `profil-kepek` storage buckettel
- **munkaviszony dátumok** – a `dolgozok.munkaviszony_kezdete` és `munkaviszony_vege` mezőkben
- **meghívás küldése** – a `meghivok` tábla rögzíti a kiküldött meghívás címzettjét, szerepkörét, szervezeti hozzárendeléseit és státuszát

### Jelenlét és napi státuszok

A `jelenleti_naplok` és `napi_statuszok` együtt támogatják a napi munkakezdés és a riportok alapját.

- a `jelenleti_naplok.nap` mező gyors napi riportolást ad
- a `napi_statuszok` tetszőlegesen bővíthető, így a jelenlegi UI-ban is látható értékek, például *Munkában*, *Késés*, *Hiányzik* vagy *Szabadság* könnyen felvehetők
- a `helyadat` és `foto_url` mezők előkészítik a későbbi GPS- és fotós igazolásokat

### Oktatások

Az oktatási modul a jelenlegi képernyők és riportok alapján nem csak anyaglistát, hanem teljesítési követést is igényel.

- az `oktatasi_anyagok` tárolják a kötelező vagy ajánlott tartalmakat
- az `oktatasi_anyagok.kategoria`, `terulet_id`, `ervenyes_tol`, `ervenyes_ig` mezők finomabb célzást és érvényességet támogatnak
- az `oktatasi_teljesitesek` tárolják a felhasználóhoz vagy dolgozóhoz kapcsolt teljesítést
- a `hatarido`, `megtekintve_at` és `teljesitesi_arany` mezők a jelenlegi admin riportokhoz is jobban illeszkednek

### Dokumentumok

A dokumentumkezelés két külön szintre bontva jelenik meg a sémában.

#### 1. Vállalati dokumentumok

A `dokumentumok` tábla a kötelezően elfogadandó vagy központilag kezelt dokumentumokat tárolja.

- `tipus`
- `verzio`
- `kotelezo`
- `ervenyes_tol`
- `ervenyes_ig`

#### 2. Elfogadási és egyedi dolgozói dokumentumok

- a `dokumentum_elfogadasok` tábla követi, hogy egy adott profil elfogadta-e a dokumentumot
- az `allapot` és `esedekes_datum` mezők a hiányzó elfogadások riportolását segítik
- a `dolgozo_dokumentumok` tábla kezeli a dolgozóhoz feltöltött külön igazolásokat, mellékleteket és admin fájlokat

### Események és jegyzőkönyvek

Az `esemenyek` tábla az adminisztratív, működési és dolgozóhoz kapcsolódó bejegyzések rögzítésére szolgál.

- **esemény rögzítése** – minden bejegyzés külön rekordként jön létre az `esemenyek` táblában
- **rövid leírás** – a `rovid_leiras` mezőben tárolva
- **részletes leírás** – a `reszletes_leiras` mezőben opcionálisan bővíthető
- **kategória** – a `kategoria` mezőben, szabadon definiálható csoportosítással
- **dátum** – az `esemeny_datum` mezőben, időbélyeggel együtt
- **csatolmány** – a `csatolmany_url` mező hivatkozik a feltöltött fájlra
- **kapcsolódó dolgozó** – a `dolgozo_id` mezővel kapcsolható egy konkrét dolgozóhoz
- **kapcsolódó terület / telephely** – a `terulet_id` és `telephely_id` mezőkkel kapcsolható szervezeti egységhez
- **rögzítő profil** – a `rogzito_profil_id` mezővel auditálható, ki hozta létre a rekordot
- **admin láthatóság** – az `admin_lathato` logikai mező szabályozza a megjelenítést

### Értesítések

Az `ertesitesek` tábla a jelenlegi webes és mobilos értesítési központ alapját adja.

- a `tipus`, `prioritas`, `allapot` és `cel` enum mezők konzisztens kliensoldali megjelenítést támogatnak
- az `admin_listaban_megjelenik` mező külön kezeli az admin összesítő nézetet
- a `forras_tipus` és `forras_azonosito` segítik a visszakövethetőséget
- a `kuldes_csatorna`, `push_elokeszitve`, `push_token`, `push_elokeszitve_at`, `push_kuldve_at` mezők előkészítik a későbbi push integrációt

### Rendszer naplók

A `rendszer_naplok` tábla audit- és hibakeresési célokra készült.

- `profil_id` – ki végezte a műveletet
- `ceg_id` – melyik szervezethez tartozott az esemény
- `muvelet` – milyen akció történt
- `entitas` és `entitas_azonosito` – melyik objektumot érintette
- `reszletek` – tetszőleges JSON részletek

## RLS és működési megjegyzések

A `docs/supabase/rls.sql` fájl a teljes induló struktúrára bekapcsolja a Row Level Security-t, és a következő alapelvet követi:

- a szuperadmin mindent láthat
- a cégadmin a saját cégéhez tartozó adatokat láthatja
- a területvezető a saját területéhez kapcsolódó adatokhoz fér hozzá
- a dolgozó legalább a saját profilját, jelenléti, oktatási és dokumentum-elfogadási adatait elérheti

## Javasolt következő lépések

- a `schema.sql` és `rls.sql` fájlokat futtasd le a Supabase projektben migrációként
- a seed adatokat csak fejlesztői vagy demo környezetben használd
- ha a riportok később éles adatforrásra váltanak, érdemes külön SQL view-kat is létrehozni a dolgozói, oktatási és hiányzó elfogadási listákhoz
