// Ez a fájl a mobil értesítési központ induló kártyáját jeleníti meg a későbbi push és lista logikák helyével.
import { StyleSheet, Text, View } from 'react-native';
import { mobilErtesitesekBetoltese } from '../szolgaltatasok/ertesitesek';

const hangsulyStilusok = {
  informacio: {
    keretSzin: 'rgba(45, 212, 191, 0.16)',
    cimkeSzin: '#99f6e4',
  },
  figyelmeztetes: {
    keretSzin: 'rgba(251, 191, 36, 0.2)',
    cimkeSzin: '#fde68a',
  },
  kritikus: {
    keretSzin: 'rgba(248, 113, 113, 0.22)',
    cimkeSzin: '#fecaca',
  },
} as const;

export function ErtesitesiKozpontKartya() {
  const ertesitesek = mobilErtesitesekBetoltese();

  return (
    <View style={stilusok.kartya}>
      <View style={stilusok.fejlecSor}>
        <View>
          <Text style={stilusok.felirat}>9. értesítések</Text>
          <Text style={stilusok.cim}>Értesítési alapstruktúra előkészítve</Text>
        </View>
        <View style={stilusok.jelveny}>
          <Text style={stilusok.jelvenySzoveg}>Push-ready</Text>
        </View>
      </View>

      <Text style={stilusok.leiras}>
        A modul külön kezeli a rendszerüzeneteket, a kötelező oktatási figyelmeztetéseket, a hiányzó napi belépéseket és az admin lista alapját.
      </Text>

      <View style={stilusok.lista}>
        {ertesitesek.map((ertesites) => {
          const hangsuly = hangsulyStilusok[ertesites.hangsuly];

          return (
            <View key={ertesites.id} style={[stilusok.sorKartya, { borderColor: hangsuly.keretSzin }]}>
              <View style={stilusok.sorFejlec}>
                <Text style={stilusok.sorCim}>{ertesites.cim}</Text>
                <Text style={[stilusok.cimke, { color: hangsuly.cimkeSzin }]}>{ertesites.cimke}</Text>
              </View>
              <Text style={stilusok.sorLeiras}>{ertesites.leiras}</Text>
              <Text style={stilusok.labjegyzet}>
                {ertesites.pushHelyFenntartva ? 'Push hely fenntartva a későbbi küldéshez.' : 'Admin összesítő listában jelenik meg.'}
              </Text>
            </View>
          );
        })}
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
  fejlecSor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  felirat: {
    color: '#14b8a6',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  cim: {
    marginTop: 6,
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  jelveny: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(20, 184, 166, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.25)',
  },
  jelvenySzoveg: {
    color: '#99f6e4',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  leiras: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 24,
  },
  lista: {
    gap: 12,
  },
  sorKartya: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: '#111827',
    borderWidth: 1,
    gap: 8,
  },
  sorFejlec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  sorCim: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  cimke: {
    fontSize: 12,
    fontWeight: '700',
  },
  sorLeiras: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
  },
  labjegyzet: {
    color: '#94a3b8',
    fontSize: 12,
  },
});
