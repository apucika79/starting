// Ez a fájl a Starting webalkalmazás gyökérkomponense, és az aktuális útvonal alapján a nyilvános vagy auth-előkészítő oldalakat jeleníti meg.
import { useEffect, useMemo, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { AuthOldal } from '@/oldalak/AuthOldal';
import { FiokOldal } from '@/oldalak/FiokOldal';
import { Fooldal } from '@/oldalak/Fooldal';
import { InformaciosOldal } from '@/oldalak/InformaciosOldal';
import { aktualisMunkamenet, recoveryAllapotAzUrlbol } from '@/szolgaltatasok/auth';
import { navigalj } from '@/segedek/navigacio';
import { supabase } from '@/szolgaltatasok/supabase';

function App() {
  const [utvonal, setUtvonal] = useState(window.location.pathname);
  const [munkamenet, setMunkamenet] = useState<Session | null>(null);
  const [munkamenetBetoltve, setMunkamenetBetoltve] = useState(false);
  const recoveryAllapot = useMemo(
    () => (utvonal === '/belepes' ? recoveryAllapotAzUrlbol() : { aktiv: false, hibaUzenet: '' }),
    [utvonal],
  );

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

  if (!munkamenetBetoltve && utvonal === '/fiok') {
    return (
      <main className="min-h-screen bg-halo px-6 py-8 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-kartya backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-starting-primerVilagos">Munkamenet ellenőrzése</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Betöltjük a belső felületet...</h1>
        </div>
      </main>
    );
  }

  if (utvonal === '/belepes') {
    if (munkamenet && !recoveryAllapot.aktiv) {
      navigalj('/fiok', { replace: true });
      return null;
    }

    return <AuthOldal mod="belepes" />;
  }

  if (utvonal === '/regisztracio') {
    return <AuthOldal mod="regisztracio" />;
  }

  if (utvonal === '/fiok') {
    if (!munkamenet) {
      navigalj('/belepes', { replace: true });
      return null;
    }

    return <FiokOldal session={munkamenet} />;
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
