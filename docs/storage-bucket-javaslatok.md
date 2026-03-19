<!-- Ez a fájl a Starting rendszerhez javasolt Supabase Storage bucket felosztást tartalmazza. -->
# Storage bucket javaslatok

## Tervezési elvek

- külön bucket a különböző érzékenységű és életciklusú fájloknak,
- privát bucket alapértelmezés szerint,
- publikus bucket csak ténylegesen publikus assetekhez,
- fájlelérési útvonalban szerepeljen a `ceg_id` és ahol indokolt a `dolgozo_id`,
- letöltéshez lehetőleg signed URL-t használj.

## Javasolt bucketek

### 1. `ceg-logok`
- **Típus:** publikus vagy signed URL-es privát.
- **Tartalom:** céges logók, brand assetek.
- **Minta útvonal:** `ceg/{ceg_id}/logo.png`
- **Hozzáférés:** admin írhatja, minden hitelesített kliens olvashatja; publikus web esetén lehet public.

### 2. `profil-kepek`
- **Típus:** privát.
- **Tartalom:** dolgozói profilképek.
- **Minta útvonal:** `ceg/{ceg_id}/dolgozo/{dolgozo_id}/avatar.jpg`
- **Hozzáférés:** saját dolgozó + admin olvasás, admin vagy önkiszolgáló profil módosítás írhat.

### 3. `oktatasi-anyagok`
- **Típus:** privát.
- **Tartalom:** videók, PDF-ek, oktatási mellékletek.
- **Minta útvonal:** `ceg/{ceg_id}/terulet/{terulet_id}/anyag/{anyag_id}/fajl.pdf`
- **Hozzáférés:** cég / terület szerinti RLS-hez illesztett olvasás.

### 4. `dokumentumok`
- **Típus:** privát.
- **Tartalom:** szabályzatok, nyilatkozatok, kötelező dokumentum sablonok.
- **Minta útvonal:** `ceg/{ceg_id}/dokumentum/{dokumentum_id}/verzio-{verzio}.pdf`
- **Hozzáférés:** admin írhatja, célzott dolgozók signed URL-en olvashatják.

### 5. `dolgozo-dokumentumok`
- **Típus:** szigorúan privát.
- **Tartalom:** alkalmassági papírok, igazolások, egyedi feltöltések.
- **Minta útvonal:** `ceg/{ceg_id}/dolgozo/{dolgozo_id}/dokumentum/{fajlnev}`
- **Hozzáférés:** érintett dolgozó, területvezető, cégadmin; letöltés csak signed URL-lel.

### 6. `jelenlet-fotok`
- **Típus:** privát.
- **Tartalom:** munkakezdéshez vagy helyszíni jelenléthez kötött fotók.
- **Minta útvonal:** `ceg/{ceg_id}/dolgozo/{dolgozo_id}/jelenlet/{nap}.jpg`
- **Hozzáférés:** dolgozó saját rekordhoz, admin audit célból.

### 7. `esemeny-csatolmanyok`
- **Típus:** privát.
- **Tartalom:** eseményekhez, jegyzőkönyvekhez feltöltött csatolmányok.
- **Minta útvonal:** `ceg/{ceg_id}/esemeny/{esemeny_id}/{fajlnev}`
- **Hozzáférés:** admin és célzott területvezető.

## Bucket policy irányelvek

### Általános szabály

- bucket szinten privát alapbeállítás,
- a kliens ne kapjon közvetlen listázási jogosultságot a teljes bucketre,
- fájlhozzáférés rekordszintű ellenőrzés után történjen.

### Egyszerű policy minta

- `ceg-logok`: select minden hitelesített usernek, insert/update csak adminoknak.
- `profil-kepek`: select saját vagy szervezeti hozzáférés alapján, update saját vagy admin.
- `dolgozo-dokumentumok`: nincs public list, csak signed URL vagy szigorú select.

## Fájlnevezési javaslatok

- kisbetűs, kötőjeles vagy UUID-alapú fájlnevek,
- verziózott dokumentumoknál szerepeljen a verzió,
- PII-t ne tegyél fájlnévbe, ha elkerülhető,
- a rekordban mindig tárolj külön metaadatot (`verzio`, `tipus`, `feltolto_profil_id`).

## Üzemeltetési javaslatok

- nagy videókhoz CDN vagy transzkódolási stratégia,
- időszakos lifecycle szabály a régi jelenlétfotókra,
- vírusellenőrzés vagy file-type ellenőrzés feltöltés után,
- audit napló a kiolvasott érzékeny dokumentumokhoz.
