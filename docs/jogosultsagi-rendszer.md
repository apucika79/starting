<!-- Ez a fájl a Starting szerepköreit és az induló hozzáférési elveket rögzíti. -->
# Jogosultsági rendszer

## Szerepkörök

- `szuperadmin`
- `ceg_admin`
- `terulet_vezeto`
- `dolgozo`

## Alapelv

Minden felhasználó csak a saját szerepkörének és szervezeti kapcsolatainak megfelelő adatot láthatja.

## Induló szabályok

- a dolgozó csak a saját profilját, jelenléteit, oktatásait és dokumentumelfogadásait láthatja
- a területvezető csak a hozzá rendelt területekhez kapcsolódó adatokhoz férhet hozzá
- a cégadmin csak a saját cégéhez tartozó elemeket kezelheti
- a szuperadmin minden szervezeti adathoz hozzáférhet
