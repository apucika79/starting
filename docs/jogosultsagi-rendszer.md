<!-- Ez a fájl a Starting szerepköreit és az induló hozzáférési elveket rögzíti. -->
# Jogosultsági rendszer

## Szerepkörök

- `szuperadmin`
- `ceg_admin`
- `terulet_vezeto`
- `dolgozo`

## Alapelv

Minden felhasználó csak a saját szerepkörének és szervezeti kapcsolatainak megfelelő adatot láthatja.

## Szigorú láthatósági szabályok

- a `dolgozo` csak a saját profilját, saját dolgozói rekordját, saját jelenléteit, saját oktatási teljesítéseit, saját dokumentumait, saját dokumentumelfogadásait és a neki címzett értesítéseket láthatja
- a `dolgozo` a saját telephelyéhez és területéhez tartozó törzsadatokat láthatja, de más dolgozók személyes adataihoz nem férhet hozzá
- a `terulet_vezeto` csak a saját területéhez tartozó profilokat, dolgozókat, jelenléteket, teljesítéseket, dokumentumokat, meghívókat és admin értesítéseket láthatja
- a `terulet_vezeto` csak a saját telephelye és területe törzsadatait láthatja, más területekhez és más cégekhez nem férhet hozzá
- a `ceg_admin` csak a saját cégéhez tartozó szervezeti adatokat, dolgozókat, jelenléteket, dokumentumokat, meghívókat, értesítéseket és naplókat láthatja
- a `szuperadmin` minden szervezeti adathoz hozzáférhet
- a rendszer globális, nem személyes törzsadatai közül a napi státuszok minden hitelesített felhasználó számára olvashatók

## RLS tervezési elvek

- minden érintett táblán kötelező a Row Level Security, és a `force row level security` is be van kapcsolva
- ahol érzékeny adatok vannak, a láthatóság mindig a bejelentkezett felhasználó `profilok` rekordjában tárolt szerepkör, cég, telephely és terület alapján dől el
- a céges és területi adminisztratív nézetek nem nyithatnak hozzáférést más szervezeti egységek adataihoz
- a dolgozói nézetek alapértelmezésben önkiszolgálóak: a felhasználó csak a saját rekordjaihoz fér hozzá
