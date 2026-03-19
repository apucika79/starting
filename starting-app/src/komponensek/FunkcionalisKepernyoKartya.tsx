// Ez a fájl az általános, adatvezérelt mobil képernyők megjelenítésére szolgáló közös kártyakomponenst tartalmazza.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { FunkcionalisKepernyoTartalom } from '../tipusok/kepernyok';

type FunkcionalisKepernyoKartyaTulajdonsagok = {
  tartalom: FunkcionalisKepernyoTartalom;
};

export function FunkcionalisKepernyoKartya({ tartalom }: FunkcionalisKepernyoKartyaTulajdonsagok) {
  return (
    <View style={stilusok.kartya}>
      <Text style={stilusok.felirat}>{tartalom.szakaszSzam}</Text>
      <Text style={stilusok.cim}>{tartalom.cim}</Text>
      <Text style={stilusok.leiras}>{tartalom.rovidLeiras}</Text>

      <View style={stilusok.kiemelesDoboz}>
        <Text style={stilusok.kiemelesCim}>Integrációs fókusz</Text>
        <Text style={stilusok.kiemelesSzoveg}>{tartalom.kiemeles}</Text>
      </View>

      <View style={stilusok.racs}>
        {tartalom.attekintoElemek.map((elem) => (
          <View key={elem.cim} style={stilusok.racsKartya}>
            <Text style={stilusok.racsCim}>{elem.cim}</Text>
            <Text style={stilusok.racsErtek}>{elem.ertek}</Text>
            <Text style={stilusok.racsLeiras}>{elem.leiras}</Text>
          </View>
        ))}
      </View>

      <View style={stilusok.teendoDoboz}>
        <Text style={stilusok.teendoCim}>Javasolt tartalmi elemek</Text>
        {tartalom.teendok.map((teendo) => (
          <View key={teendo.cim} style={stilusok.teendoSor}>
            <Text style={stilusok.teendoPont}>•</Text>
            <View style={stilusok.teendoSzovegek}>
              <Text style={stilusok.teendoSzoveg}>{teendo.cim}</Text>
              <Text style={stilusok.teendoAllapot}>{teendo.allapot}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={stilusok.gombSor}>
        <Pressable style={stilusok.foGomb}>
          <Text style={stilusok.foGombSzoveg}>{tartalom.foMuvelet}</Text>
        </Pressable>
        <Pressable style={stilusok.masodlagosGomb}>
          <Text style={stilusok.masodlagosGombSzoveg}>{tartalom.masodlagosMuvelet}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const stilusok = StyleSheet.create({
  kartya: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    gap: 14,
  },
  felirat: {
    color: '#14b8a6',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  cim: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  leiras: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 24,
  },
  kiemelesDoboz: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.18)',
    gap: 8,
  },
  kiemelesCim: {
    color: '#99f6e4',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  kiemelesSzoveg: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 22,
  },
  racs: {
    gap: 12,
  },
  racsKartya: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.14)',
    gap: 6,
  },
  racsCim: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  racsErtek: {
    color: '#2dd4bf',
    fontSize: 14,
    fontWeight: '700',
  },
  racsLeiras: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  },
  teendoDoboz: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    gap: 10,
  },
  teendoCim: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  teendoSor: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  teendoPont: {
    color: '#2dd4bf',
    fontSize: 18,
    lineHeight: 22,
  },
  teendoSzovegek: {
    flex: 1,
    gap: 2,
  },
  teendoSzoveg: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  teendoAllapot: {
    color: '#94a3b8',
    fontSize: 12,
  },
  gombSor: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  foGomb: {
    flexGrow: 1,
    minWidth: 160,
    borderRadius: 18,
    backgroundColor: '#14b8a6',
    paddingVertical: 14,
    alignItems: 'center',
  },
  foGombSzoveg: {
    color: '#042f2e',
    fontSize: 15,
    fontWeight: '700',
  },
  masodlagosGomb: {
    flexGrow: 1,
    minWidth: 160,
    borderRadius: 18,
    backgroundColor: '#111827',
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
  },
  masodlagosGombSzoveg: {
    color: '#cbd5e1',
    fontSize: 15,
    fontWeight: '700',
  },
});
