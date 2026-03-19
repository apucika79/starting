// Ez a fájl a Starting mobil főképernyő induló áttekintő blokkjait jeleníti meg a későbbi modulok helyével együtt.
import { StyleSheet, Text, View } from 'react-native';
import type { AttekintoKartya } from '../tipusok/fooldal';

const attekintoKartyak: AttekintoKartya[] = [
  {
    cim: 'Napi munkakezdés',
    ertek: '1 érintéses indítás',
    leiras: 'Gyors napi belépés és státuszrögzítés dolgozói használatra.',
  },
  {
    cim: 'Kötelező oktatások',
    ertek: 'Web + mobil',
    leiras: 'Előrehaladás, elfogadás és megtekintési állapot egy helyen.',
  },
  {
    cim: 'Értesítések',
    ertek: 'Előkészített struktúra',
    leiras: 'Később push és rendszerüzeneti bővítések fogadására kész.',
  },
];

export function FokepernyoAttekintes() {
  return (
    <View style={stilusok.szakasz}>
      <Text style={stilusok.felirat}>Főképernyő</Text>
      <Text style={stilusok.cim}>Starting mobil áttekintés</Text>
      <Text style={stilusok.leiras}>
        Az alkalmazás szerkezete már most moduláris: külön helyet kapnak a képernyők, a szolgáltatások, a típusok és az állapotkezelés.
      </Text>

      <View style={stilusok.racs}>
        {attekintoKartyak.map((kartya) => (
          <View key={kartya.cim} style={stilusok.kartya}>
            <Text style={stilusok.kartyaCim}>{kartya.cim}</Text>
            <Text style={stilusok.kartyaErtek}>{kartya.ertek}</Text>
            <Text style={stilusok.kartyaLeiras}>{kartya.leiras}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const stilusok = StyleSheet.create({
  szakasz: {
    gap: 12,
  },
  felirat: {
    color: '#14b8a6',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  cim: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  leiras: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 24,
  },
  racs: {
    gap: 12,
    marginTop: 4,
  },
  kartya: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
    gap: 8,
  },
  kartyaCim: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  kartyaErtek: {
    color: '#2dd4bf',
    fontSize: 14,
    fontWeight: '700',
  },
  kartyaLeiras: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
  },
});
