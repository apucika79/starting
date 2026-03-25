// Ez a fájl a Starting webalkalmazás gyökérkomponense, és az aktuális útvonal alapján a nyilvános vagy védett oldalakat jeleníti meg.
import { useEffect, useMemo, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { AuthOldal } from '@/oldalak/AuthOldal';
import { FiokOldal } from '@/oldalak/FiokOldal';
import { Fooldal } from '@/oldalak/Fooldal';
import { InformaciosOldal } from '@/oldalak/InformaciosOldal';
import { DemoOldal } from '@/oldalak/DemoOldal';
import { VedettModulOldal } from '@/oldalak/VedettModulOldal';
import { aktualisMunkamenet, recoveryAllapotAzUrlbol } from '@/szolgaltatasok/auth';
import { navigalj } from '@/segedek/navigacio';
import { supabase } from '@/szolgaltatasok/supabase';

type VedettOldalTartalom = {
  felirat: string;
  cim: string;
  leiras: string;
};

const vedettOldalak: Record<string, VedettOldalTartalom> = {
  '/vezerlopult': {
    felirat: 'Védett kezdőoldal',
    cim: 'A Starting vezérlőpultja egyben marad a jelenlegi belső működéssel.',
    leiras:
      'A vezérlőpult most a már meglévő belépés utáni profil- és szerepkörnézetet használja, így a routing igazodik az új URL-struktúrához anélkül, hogy megtörné az eddigi auth folyamatot.',
  },
  '/profil': {
    felirat: 'Profil',
    cim: 'A profiloldal helye készen áll a felhasználói és szervezeti adatok részletes kezeléséhez.',
    leiras:
      'Ide kerülhet a személyes adatok, jogosultságok, céges hozzárendelések és digitális elfogadások részletes kezelése, ugyanazzal a védett session modellel, mint amit a rendszer most is használ.',
  },
  '/cegek': {
    felirat: 'Cégek',
    cim: 'A többcéges működéshez előkészített admin felület saját route-ot kapott.',
    leiras:
      'A Starting jelenlegi architektúrája már eleve több cégre készül, ezért ez az oldal természetes helye lesz a céges törzsadatok, státuszok és adminisztratív kapcsolatok kezelésének.',
  },
  '/telephelyek': {
    felirat: 'Telephelyek',
    cim: 'A telephelyek kezelése önálló védett nézetként illeszkedik a teljes rendszerbe.',
    leiras:
      'A későbbi jelenléti, oktatási és eseménykezelési funkciók telephely szerinti szűrése és riportálása ehhez a modulhoz kapcsolható majd, egységes belső navigációval.',
  },
  '/teruletek': {
    felirat: 'Területek',
    cim: 'A szervezeti területek oldala már most megkapta a végleges helyét a weben.',
    leiras:
      'Ez a route a részlegek, területi vezetők és területhez kötött dolgozói viszonyok kezelésének fog helyet adni, szinkronban a szerepkör-alapú hozzáféréssel.',
  },
  '/dolgozok': {
    felirat: 'Dolgozók',
    cim: 'A dolgozói modul route-ja készen áll a meghívásos és adminisztratív folyamatok folytatására.',
    leiras:
      'A meghívás, státuszkezelés, hozzárendelések, dokumentumelfogadások és jelenléti összefoglalók természetes központja lesz ez a képernyő.',
  },
  '/jelenlet': {
    felirat: 'Jelenlét',
    cim: 'A napi munkakezdés és státusznaplózás önálló, védett felületet kapott.',
    leiras:
      'A már dokumentált munkakezdési és jelenléti célok alapján ez a modul fogja összefogni a napi belépéseket, státuszváltásokat és a későbbi riportálási nézeteket.',
  },
  '/oktatasok': {
    felirat: 'Oktatások',
    cim: 'Az oktatási modul útvonala készen áll a kötelező és ajánlott anyagok kezelésére.',
    leiras:
      'A videók, dokumentumok, teljesítési állapotok és digitális visszaigazolások ugyanarra a védett alkalmazásvázra épülhetnek rá, amely most is működik.',
  },
  '/dokumentumok': {
    felirat: 'Dokumentumok',
    cim: 'A dokumentumkezelés számára külön route készült a későbbi auditálható folyamatokhoz.',
    leiras:
      'Ez a nézet ad majd helyet a dokumentumtárnak, elfogadási állapotoknak és az adminisztratív ellenőrzéshez szükséges verziózott tartalmaknak.',
  },
  '/ertesitesek': {
    felirat: 'Értesítések',
    cim: 'Az értesítési központ helye a védett webes felületen is rögzítve van.',
    leiras:
      'A meglévő in-app értesítési logika továbbépíthető itt admin listával, prioritásokkal, dolgozói figyelmeztetésekkel és későbbi többcsatornás bővítéssel.',
  },
  '/esemenyek': {
    felirat: 'Események',
    cim: 'Az események és jegyzőkönyvek modulja már illeszkedik a végleges URL-szerkezetbe.',
    leiras:
      'A strukturált eseményrögzítés, kategorizálás, dátumkezelés és csatolmányozás számára ez a route biztosít konzisztens kiindulópontot.',
  },
  '/beallitasok': {
    felirat: 'Beállítások',
    cim: 'A rendszerbeállítások oldalának helye előkészítve, az eddigi auth és márkaélménnyel együtt.',
    leiras:
      'Itt kezelhetők majd a fiókszintű, szervezeti és platformszintű opciók, miközben a felület vizuálisan és működésében is összhangban marad a teljes Starting rendszerrel.',
  },
  '/admin': {
    felirat: 'Admin',
    cim: 'Az admin nézet route-ja külön védett végpontként működik a magasabb jogosultságú funkciókhoz.',
    leiras:
      'A későbbi admin dashboardok, összesítők és jogosultsági beavatkozások ehhez az oldalhoz köthetők, szerepkör-alapú megjelenítéssel.',
  },
};

function App() {
  const [utvonal, setUtvonal] = useState(window.location.pathname);
  const [munkamenet, setMunkamenet] = useState<Session | null>(null);
  const [munkamenetBetoltve, setMunkamenetBetoltve] = useState(false);
  const recoveryAllapot = useMemo(
    () => (utvonal === '/belepes' || utvonal === '/elfelejtett-jelszo' ? recoveryAllapotAzUrlbol() : { aktiv: false, hibaUzenet: '' }),
    [utvonal],
  );
  const vedettOldalTartalom = vedettOldalak[utvonal];

  useEffect(() => {
    const kezeliPopState = () => {
      setUtvonal(window.location.pathname);
    };

    window.addEventListener('popstate', kezeliPopState);

    return () => {
      window.removeEventListener('popstate', kezeliPopState);
    };
  }, []);

  useEffect(() => {
    let aktiv = true;

    aktualisMunkamenet()
      .then(({ data }) => {
        if (!aktiv) {
          return;
        }

        setMunkamenet(data.session);
      })
      .finally(() => {
        if (aktiv) {
          setMunkamenetBetoltve(true);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_esemeny: AuthChangeEvent, session: Session | null) => {
      setMunkamenet(session);
      setMunkamenetBetoltve(true);
      setUtvonal(window.location.pathname);
    });

    return () => {
      aktiv = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!munkamenetBetoltve && (utvonal === '/fiok' || utvonal === '/vezerlopult' || utvonal === '/belepes' || utvonal === '/regisztracio' || utvonal === '/elfelejtett-jelszo' || Boolean(vedettOldalTartalom))) {
    return (
      <main className="min-h-screen bg-halo px-6 py-8 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-kartya backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-starting-primerVilagos">Munkamenet ellenőrzése</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Betöltjük a megfelelő felületet...</h1>
        </div>
      </main>
    );
  }

  if (utvonal === '/belepes') {
    if (munkamenet && !recoveryAllapot.aktiv) {
      navigalj('/vezerlopult', { replace: true });
      return null;
    }

    return <AuthOldal mod="belepes" />;
  }

  if (utvonal === '/elfelejtett-jelszo') {
    if (munkamenet && !recoveryAllapot.aktiv) {
      navigalj('/vezerlopult', { replace: true });
      return null;
    }

    return <AuthOldal mod="belepes" kezdoJelszoResetMod />;
  }

  if (utvonal === '/regisztracio') {
    if (munkamenet) {
      navigalj('/vezerlopult', { replace: true });
      return null;
    }

    return <AuthOldal mod="regisztracio" />;
  }

  if (utvonal === '/fiok' || utvonal === '/vezerlopult') {
    if (!munkamenet) {
      navigalj('/belepes', { replace: true });
      return null;
    }

    return <FiokOldal session={munkamenet} />;
  }

  if (vedettOldalTartalom) {
    if (!munkamenet) {
      navigalj('/belepes', { replace: true });
      return null;
    }

    return <VedettModulOldal aktivUtvonal={utvonal} session={munkamenet} {...vedettOldalTartalom} />;
  }

  if (utvonal === '/demo') {
    return <DemoOldal />;
  }

  if (utvonal === '/adatkezeles') {
    return (
      <InformaciosOldal
        felirat="Adatkezelés"
        cim="Az adatkezelési tájékoztató helye előkészítve."
        leiras="Ez a statikus oldal fenntartja a helyet a későbbi részletes adatkezelési tartalomnak, hogy a nyilvános felület linkjei már most működő útvonalra mutassanak."
      />
    );
  }

  if (utvonal === '/aszf') {
    return (
      <InformaciosOldal
        felirat="ÁSZF"
        cim="Az általános szerződési feltételek helye előkészítve."
        leiras="A landing oldal jogi hivatkozásai mostantól működő képernyőkre érkeznek, így a következő iterációban ide könnyen beilleszthető a végleges tartalom."
      />
    );
  }

  return <Fooldal />;
}

export default App;
