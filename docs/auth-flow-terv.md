<!-- Ez a fájl a Starting induló hitelesítési folyamatának tervét foglalja össze Supabase Auth használathoz. -->
# Auth flow terv

## Induló irány

- email + jelszó alapú belépés
- meghívásos regisztráció
- elfelejtett jelszó folyamat kérő és visszaérkező képernyővel
- védett webes és mobilos felületek
- szerepkör alapú profilbetöltés a belépés után

## Aktuális állapot

- email + jelszó alapú belépés működő Supabase kapcsolattal
- jelszó-visszaállító email kérhető a belépési képernyőről
- a recovery link visszatérése után új jelszó állítható be ugyanazon a webes auth felületen
- belépés után a webes fiókoldal megpróbálja betölteni a szerepkörhöz kötött profilt is

## Későbbi lépések

- meghívó token validáció
- munkamenet-frissítés kezelése
- kilépés minden kliensen
