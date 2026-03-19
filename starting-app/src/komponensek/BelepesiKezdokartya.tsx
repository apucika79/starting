// Ez a fájl a Starting mobil belépő kártyáját jeleníti meg, amely a későbbi hitelesítés kiindulópontja lesz.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { alkalmazasKonfiguracio } from '../segedek/konfiguracio';

export function BelepesiKezdokartya() {
  return (
    <View style={stilusok.kartya}>
      <View style={stilusok.jelvenySor}>
        <View style={stilusok.jelvenyKor}>
          <Text style={stilusok.jelvenyBetu}>S</Text>
        </View>
        <View>
          <Text style={stilusok.markaNev}>Starting</Text>
          <Text style={stilusok.markaLeiras}>Munkakezdés, jelenlét, oktatás és adminisztráció</Text>
        </View>
      </View>

      <Text style={stilusok.cim}>Belépés előkészítve a közös háttérrendszerhez</Text>
      <Text style={stilusok.leiras}>
        A mobilalkalmazás ugyanahhoz a rendszerhez kapcsolódik, mint a webes felület. A következő szakaszban ide érkezik a Supabase Auth alapú belépés.
      </Text>

      <Pressable style={stilusok.gomb}>
        <Text style={stilusok.gombSzoveg}>Belépés indítása</Text>
      </Pressable>

      <Text style={stilusok.labjegyzet}>Domain előkészítve: {alkalmazasKonfiguracio.domain.replace('https://', '')}</Text>
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
  jelvenySor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  jelvenyKor: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f766e',
  },
  jelvenyBetu: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  markaNev: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  markaLeiras: {
    color: '#cbd5e1',
    fontSize: 13,
    marginTop: 2,
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
  gomb: {
    marginTop: 4,
    borderRadius: 18,
    backgroundColor: '#14b8a6',
    paddingVertical: 14,
    alignItems: 'center',
  },
  gombSzoveg: {
    color: '#042f2e',
    fontSize: 15,
    fontWeight: '700',
  },
  labjegyzet: {
    color: '#94a3b8',
    fontSize: 12,
  },
});
