<!-- Ez a fájl a Starting induló adatbázis-struktúráját foglalja össze Supabase használathoz. -->
# Adatbázis séma

## Áttekintés

A `docs/supabase/schema.sql` egy induló, többcéges Supabase adatmodellt ad a Starting számára. A séma közös alapot biztosít a webes és mobil klienshez, a riportokhoz, a meghívásos auth flow-hoz és a storage-alapú fájlkezeléshez.

## Fő modulok

### 1. Szervezeti törzsadatok
- `cegek`
- `telephelyek`
- `teruletek`
- `profilok`
- `dolgozok`
- `meghivok`

### 2. Operatív modulok
- `napi_statuszok`
- `jelenleti_naplok`
- `oktatasi_anyagok`
- `oktatasi_teljesitesek`
- `dokumentumok`
- `dolgozo_dokumentumok`
- `dokumentum_elfogadasok`
- `esemenyek`
- `ertesitesek`
- `rendszer_naplok`

## Kiemelt tervezési döntések

- **UUID minden elsődleges kulcshoz** a kliensoldali és többkörnyezetes seedelés megkönnyítésére.
- **Enumok** a szerepkörökhöz, értesítésekhez, státuszokhoz és elfogadási állapotokhoz.
- **`letrehozva` / `frissitve` mezők** minden érdemi szerkeszthető táblán.
- **Soft delete** csak ott, ahol admin helyreállítás üzletileg releváns.
- **RLS-kompatibilis oszlopszerkezet**: a legtöbb táblában jelen van a `ceg_id`, gyakran a `terulet_id` és `profil_id` / `dolgozo_id` is.
- **Trigger alapú auth profil-szinkron** a meghívásos onboardinghoz.

## Kapcsolati logika röviden

- Egy `ceg` több `telephely`-et tartalmaz.
- Egy `telephely` több `terulet`-et tartalmaz.
- Egy `profil` egy Supabase auth userhez tartozik.
- Egy `dolgozo` egy `profil` operatív megfelelője.
- Egy `meghivo` előkészíti a majdani `profil` / `dolgozo` rekordot.
- A jelenlét, oktatás, dokumentum-elfogadás és értesítés mind a profil / dolgozó és szervezeti hierarchia köré épül.

## Auth-hoz kapcsolódó SQL elemek

A séma nem csak táblákat, hanem auth-flow-t segítő SQL objektumokat is tartalmaz:

- `ervenyes_meghivo_ellenorzese(...)` RPC a kliensoldali tokenellenőrzéshez.
- `profil_letrehozasa_meghivobol()` triggerfüggvény az `auth.users` eseményre.
- `frissitesi_idobelyeg_beallitasa()` közös triggerfüggvény a `frissitve` mezőkhöz.

## Indexelési stratégia

A séma külön indexeli azokat a mezőket, amelyeket a UI és a riportok várhatóan sokat szűrnek:

- szervezeti horgonyok: `ceg_id`, `telephely_id`, `terulet_id`,
- auth és admin mezők: `email`, `szerepkor`, `token`,
- riport mezők: `nap`, `hatarido`, `allapot`, `prioritas`,
- audit mezők: `entitas`, `entitas_azonosito`, `esemeny_datum`.

## Fejlesztői seed lefedettség

A `docs/supabase/seed.sql` minden fő modulhoz tartalmaz mintát:

- 2 cég,
- több telephely és terület,
- admin, vezető és dolgozó profilok,
- függő meghívók,
- jelenléti rekordok,
- oktatási és dokumentum elfogadási példák,
- értesítések és rendszer naplók.

## Fájlok

- `docs/supabase/schema.sql` – séma, indexek, triggerek, RPC.
- `docs/supabase/rls.sql` – helper függvények és policy-k.
- `docs/supabase/seed.sql` – fejlesztői mintaadatok.
- `docs/storage-bucket-javaslatok.md` – storage struktúra.
- `docs/auth-flow-terv.md` – auth működési terv.
- `docs/kornyezeti-valtozok.md` – környezeti változók listája.

## Javasolt bevezetési sorrend

1. Új Supabase projekt létrehozása.
2. `schema.sql` futtatása migrációként.
3. `rls.sql` futtatása a policy-k aktiválásához.
4. `seed.sql` futtatása csak dev / demo környezetben.
5. Storage bucketek létrehozása.
6. Auth redirect URL-ek és email sablonok beállítása.
7. Kliens `.env` fájlok kitöltése.
