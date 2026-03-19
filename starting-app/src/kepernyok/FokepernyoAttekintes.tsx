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

const maiMunkanapLepesek = [
  { cim: 'Telephely megerősítve', allapot: 'Automatikus', leiras: 'A dolgozó a kijelölt telephelyhez vagy munkaterülethez kapcsolódik.' },
  { cim: 'Munkakezdés rögzítése', allapot: 'Elsődleges', leiras: 'A fő CTA egyetlen érintéssel indítható napi belépési folyamatot jelöl.' },
  { cim: 'Védőeszköz / nyilatkozat', allapot: 'Kötelező', leiras: 'A napi admin ellenőrzések rövid listában jelennek meg indulás előtt.' },
  { cim: 'Napközbeni visszanézés', allapot: 'Átlátható', leiras: 'A dolgozó később is visszaláthatja a rögzített státuszt és eseményeket.' },
];

const nyitottTetelKartyak = [
  { cim: 'Mai teendők', ertek: '3 db', leiras: 'Munkakezdés, egy kötelező oktatás és 1 dokumentum vár jóváhagyásra.' },
  { cim: 'Utolsó szinkron', ertek: '08:12', leiras: 'A mobilapp friss állapotot mutat a vezetői háttérrendszerrel.' },
  { cim: 'Kiemelt riasztás', ertek: '1 kritikus', leiras: 'Hiányzó napi belépés esetén azonnali figyelmeztetés küldhető.' },
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
        <Text style={stilusok.kiemeltCim}>Mai munkanap fókusz</Text>
        <Text style={stilusok.kiemeltLeiras}>
          A képernyő elsődleges feladata, hogy néhány másodperc alatt elindíthatóvá tegye a napi belépést, és közben megmutassa a kötelező
          oktatásokat, dokumentumokat és figyelmeztetéseket.
        </Text>
      </View>

      <View style={stilusok.informaciosRacs}>
        {nyitottTetelKartyak.map((kartya) => (
          <View key={kartya.cim} style={stilusok.informaciosKartya}>
            <Text style={stilusok.informaciosCim}>{kartya.cim}</Text>
            <Text style={stilusok.informaciosErtek}>{kartya.ertek}</Text>
            <Text style={stilusok.informaciosLeiras}>{kartya.leiras}</Text>
          </View>
        ))}
      </View>

      <View style={stilusok.folyamatDoboz}>
        <Text style={stilusok.folyamatCim}>Munkakezdési folyamat egy képernyőn</Text>
        {maiMunkanapLepesek.map((lepes, index) => (
          <View key={lepes.cim} style={stilusok.folyamatSor}>
            <View style={stilusok.folyamatSorszamKor}>
              <Text style={stilusok.folyamatSorszam}>{index + 1}</Text>
            </View>
            <View style={stilusok.folyamatTartalom}>
              <View style={stilusok.folyamatFejlec}>
                <Text style={stilusok.folyamatTetelCim}>{lepes.cim}</Text>
                <Text style={stilusok.folyamatAllapot}>{lepes.allapot}</Text>
              </View>
              <Text style={stilusok.folyamatLeiras}>{lepes.leiras}</Text>
            </View>
          </View>
        ))}
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
  informaciosRacs: {
    gap: 10,
  },
  informaciosKartya: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
    gap: 6,
  },
  informaciosCim: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  informaciosErtek: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  informaciosLeiras: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
  },
  folyamatDoboz: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    gap: 12,
  },
  folyamatCim: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  folyamatSor: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  folyamatSorszamKor: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 184, 166, 0.16)',
    marginTop: 2,
  },
  folyamatSorszam: {
    color: '#99f6e4',
    fontSize: 13,
    fontWeight: '700',
  },
  folyamatTartalom: {
    flex: 1,
    gap: 4,
  },
  folyamatFejlec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  folyamatTetelCim: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
  },
  folyamatAllapot: {
    color: '#2dd4bf',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  folyamatLeiras: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
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
