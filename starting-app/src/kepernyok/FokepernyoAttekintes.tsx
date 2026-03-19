// Ez a fájl a Starting mobil főképernyőjének kibővített áttekintését jeleníti meg a kért modulok rövid összefoglalójával.
import { StyleSheet, Text, View } from 'react-native';
import type { AttekintoKartya } from '../tipusok/fooldal';

const attekintoKartyak: AttekintoKartya[] = [
  {
    cim: 'Bejelentkezés és profil',
    ertek: 'SSO + biometria',
    leiras: 'Gyors belépés, profiladatok és jogosultságok a napi munkakezdés előkészítéséhez.',
  },
  {
    cim: 'Munkakezdés és jelenlétek',
    ertek: 'Napi folyamat',
    leiras: 'Egyetlen útvonalon rögzíthető a munkakezdés, majd visszanézhetők a jelenléti adatok.',
  },
  {
    cim: 'Oktatás és dokumentumok',
    ertek: 'Kötelező modulok',
    leiras: 'Tananyagok, tesztek és dokumentum-elfogadások egységes státuszkezeléssel.',
  },
  {
    cim: 'Értesítések és beállítások',
    ertek: 'Személyre szabható',
    leiras: 'Push üzenetek, emlékeztetők és preferenciák ugyanabban az alkalmazásélményben.',
  },
];

export function FokepernyoAttekintes() {
  return (
    <View style={stilusok.szakasz}>
      <Text style={stilusok.felirat}>2. képernyő</Text>
      <Text style={stilusok.cim}>Főképernyő: minden fontos modul egy közös mobil flow-ban</Text>
      <Text style={stilusok.leiras}>
        A főképernyő összefogja a munkakezdéshez szükséges gyorsműveleteket, a profil- és jelenléti állapotot,
        valamint a kötelező feladatokat. Innen érhető el az összes újonnan beépített képernyő.
      </Text>

      <View style={stilusok.kiemeltDoboz}>
        <Text style={stilusok.kiemeltCim}>Kiemelt gyorsműveletek</Text>
        <Text style={stilusok.kiemeltLeiras}>
          Mai munkakezdés indítása, függőben lévő dokumentumok megnyitása, lejáró oktatások és új értesítések.
        </Text>
      </View>

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
    borderRadius: 28,
    padding: 20,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
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
    lineHeight: 36,
  },
  leiras: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 24,
  },
  kiemeltDoboz: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.18)',
    gap: 6,
  },
  kiemeltCim: {
    color: '#99f6e4',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  kiemeltLeiras: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 22,
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
