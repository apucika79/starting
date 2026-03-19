// Ez a fájl a Starting mobilalkalmazás demó belépőpontja, amely a kért fő képernyőket egy meglévő, görgethető felületbe integrálja.
import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { funkcionalisKepernyok } from './src/adatok/kepernyok';
import { BelepesiKezdokartya } from './src/komponensek/BelepesiKezdokartya';
import { ErtesitesiKozpontKartya } from './src/komponensek/ErtesitesiKozpontKartya';
import { FunkcionalisKepernyoKartya } from './src/komponensek/FunkcionalisKepernyoKartya';
import { KepernyoValaszto } from './src/komponensek/KepernyoValaszto';
import { FokepernyoAttekintes } from './src/kepernyok/FokepernyoAttekintes';
import type { MobilKepernyoAzonosito } from './src/tipusok/kepernyok';

const alkalmazasMutatok = [
  { cim: 'Kiemelt cél', ertek: 'Napi munkakezdés 1 flow-ban' },
  { cim: 'Dolgozói fókusz', ertek: 'Belépés + jelenlét + oktatás' },
  { cim: 'Vezetői haszon', ertek: 'Átlátható visszajelzés és utánkövetés' },
];

export default function App() {
  const [aktivKepernyo, setAktivKepernyo] = useState<MobilKepernyoAzonosito>('fokepernyo');

  const aktualisTartalom = useMemo(() => {
    switch (aktivKepernyo) {
      case 'bejelentkezes':
        return <BelepesiKezdokartya />;
      case 'fokepernyo':
        return <FokepernyoAttekintes />;
      case 'ertesitesek':
        return <ErtesitesiKozpontKartya />;
      default:
        return <FunkcionalisKepernyoKartya tartalom={funkcionalisKepernyok[aktivKepernyo]} />;
    }
  }, [aktivKepernyo]);

  return (
    <SafeAreaView style={stilusok.keret}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={stilusok.gorgetettTartalom} showsVerticalScrollIndicator={false}>
        <View style={stilusok.fejlecKartya}>
          <Text style={stilusok.felirat}>Starting mobilapp</Text>
          <Text style={stilusok.cim}>A napi dolgozói feladatokra fókuszáló app-váz, a teljes fő flow-val</Text>
          <Text style={stilusok.leiras}>
            Az alábbi nézetben egységes vizuális rendszerben bejárható a bejelentkezés, a főképernyő, a profil,
            a jelenléti és oktatási folyamatok, a dokumentum elfogadás, az értesítések és a beállítások képernyője.
          </Text>
        </View>

        <View style={stilusok.mutatoKartya}>
          {alkalmazasMutatok.map((mutato) => (
            <View key={mutato.cim} style={stilusok.mutatoDoboz}>
              <Text style={stilusok.mutatoCim}>{mutato.cim}</Text>
              <Text style={stilusok.mutatoErtek}>{mutato.ertek}</Text>
            </View>
          ))}
        </View>

        <KepernyoValaszto aktivKepernyo={aktivKepernyo} kepernyoValasztas={setAktivKepernyo} />
        {aktualisTartalom}
      </ScrollView>
    </SafeAreaView>
  );
}

const stilusok = StyleSheet.create({
  keret: {
    flex: 1,
    backgroundColor: '#020617',
  },
  gorgetettTartalom: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 18,
    backgroundColor: '#020617',
  },
  fejlecKartya: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: '#081120',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    gap: 10,
  },
  felirat: {
    color: '#14b8a6',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.8,
  },
  cim: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  leiras: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 24,
  },
  mutatoKartya: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    gap: 12,
  },
  mutatoDoboz: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.14)',
    gap: 4,
  },
  mutatoCim: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mutatoErtek: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
});
