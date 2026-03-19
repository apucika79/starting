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

## 6. Oktatási modul

Ez a modul a dolgozók kötelező és ajánlott oktatási anyagainak központi kezelését, nyomon követését és digitális visszaigazolását támogatja.

- **oktatóvideók feltöltése** – a rendszer támogatja belső képzési videók feltöltését és szervezett közzétételét
- **PDF / dokumentum feltöltése** – az oktatási anyagok között PDF-ek és egyéb kapcsolódó dokumentumok is kezelhetők
- **kategóriák** – a tartalmak témakörök, részlegek vagy képzési típusok szerint csoportosíthatók
- **kötelező anyagok** – megjelölhető, hogy mely oktatási elemek teljesítése szükséges az adott dolgozó vagy szerepkör számára
- **megtekintési állapot** – a rendszer követi, hogy a dolgozó mely anyagokat nyitotta meg vagy tekintette meg
- **elfogadási jelölés** – az anyagokhoz külön visszajelzés rögzíthető arról, hogy a dolgozó elolvasta vagy megismerte azokat
- **digitális megerősítés** – a folyamat digitális jóváhagyással vagy megerősítő nyilatkozattal zárható le
- **oktatási előrehaladás** – a dolgozók és adminisztrátorok számára is átlátható a képzések teljesítési állapota és előrehaladása

## 8. Események és jegyzőkönyvek

Ez a modul az adminisztratív, HR, munkavédelmi vagy operatív események strukturált rögzítését és visszakeresését támogatja.

- **esemény rögzítése** – minden releváns történés önálló bejegyzésként menthető a rendszerben
- **rövid leírás** – az eseményhez rövid, gyorsan átlátható összefoglaló tartozik
- **kategória** – az események típus szerint csoportosíthatók, például incidens, jegyzőkönyv vagy adminisztratív feljegyzés formában
- **dátum rögzítése** – minden esemény pontos eseménydátummal kerül naplózásra
- **csatolmány kezelése** – dokumentum, kép vagy egyéb fájl is kapcsolható az eseményhez
- **kapcsolódó dolgozó vagy terület** – az esemény összeköthető egy konkrét dolgozóval vagy szervezeti területtel
- **admin láthatóság** – külön jelölhető, hogy az adott bejegyzés kizárólag adminisztratív körben legyen elérhető
