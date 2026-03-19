<!-- Ez a fájl a Starting rendszer induló üzleti és technikai áttekintését tartalmazza. -->
# Projekt áttekintés

## Mi a Starting?

A Starting egy magyar nyelvű, több szerepkörös digitális rendszer, amely támogatja a dolgozók beléptetését, napi munkakezdését, jelenléti naplózását, oktatását, dokumentumelfogadását és adminisztrációját.

## Induló célok

- stabil monorepo alap létrehozása
- egységes márkanév használata: Starting
- közös backend előkészítése webhez és mobilhoz
- reszponzív, professzionális landing oldal indítása
- mobil belépő és főképernyő előkészítése

## Első szakasz eredménye

Ebben a szakaszban elkészül a teljes induló mappaszerkezet, a web és a mobil futtatható alapja, valamint a legfontosabb dokumentációs és környezeti változó minták.

## 5. Munkakezdés és jelenlét

Ez a modul a napi munkába állás egyszerű, naplózható és később bővíthető kezelését támogatja.

- **napi bejelentkezés munkakezdéskor** – a dolgozó a munkanap elején egyértelműen jelzi, hogy megkezdte a napi munkavégzést
- **munkába állás rögzítése** – a rendszer külön eseményként menti a munkakezdést, hogy az később visszakereshető és riportálható legyen
- **státusz kiválasztása** – a dolgozó a munkakezdéshez kapcsolódó aktuális állapotot választja ki, például munkában, késésben vagy egyéb előre definiált státuszban
- **időbélyeg rögzítése** – minden munkakezdési esemény pontos dátummal és időponttal kerül mentésre
- **opcionális helyadat előkészítése** – a folyamat kialakítása támogatja, hogy később helyszín- vagy GPS-adat is társítható legyen a bejelentkezéshez
- **opcionális fotós igazolás előkészítése** – a modulban fenntartott hely van arra, hogy később fényképes igazolás is csatolható legyen a munkakezdéshez
- **napi jelenléti napló** – a napi események összesített és visszakereshető naplóban jelennek meg
- **státusztörténet** – a rendszer megőrzi az egymást követő státuszváltásokat, így a napi jelenlét teljes folyamata nyomon követhető
- **munkanap lezárás előkészítése** – a struktúra előkészített arra, hogy később külön munkanapzárás is rögzíthető legyen
