// Ez a fájl a Starting webalkalmazás gyökérkomponense, és az aktuális útvonal alapján a nyilvános vagy auth-előkészítő oldalakat jeleníti meg.
import { AuthOldal } from '@/oldalak/AuthOldal';
import { Fooldal } from '@/oldalak/Fooldal';
import { InformaciosOldal } from '@/oldalak/InformaciosOldal';

function App() {
  const utvonal = window.location.pathname;

  if (utvonal === '/belepes') {
    return <AuthOldal mod="belepes" />;
  }

  if (utvonal === '/regisztracio') {
    return <AuthOldal mod="regisztracio" />;
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
