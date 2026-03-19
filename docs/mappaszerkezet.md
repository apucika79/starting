<!-- Ez a fájl a Starting monorepo mappaszerkezetét írja le, hogy a fejlesztés átlátható és bővíthető maradjon. -->
# Mappaszerkezet

```text
starting/
├─ starting-web/
│  ├─ src/
│  │  ├─ allapot/
│  │  ├─ komponensek/
│  │  ├─ horgok/
│  │  ├─ oldalak/
│  │  ├─ segedek/
│  │  ├─ szolgaltatasok/
│  │  ├─ stilusok/
│  │  └─ tipusok/
├─ starting-app/
│  ├─ src/
│  │  ├─ allapot/
│  │  ├─ kepernyok/
│  │  ├─ komponensek/
│  │  ├─ segedek/
│  │  ├─ szolgaltatasok/
│  │  └─ tipusok/
└─ docs/
   └─ supabase/
```

## Elv

A web, a mobil és a dokumentáció különálló, mégis összehangolt egységekből áll. A későbbi közös logikák számára külön csomag vagy megosztott modul később könnyen bevezethető.
