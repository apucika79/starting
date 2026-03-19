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
