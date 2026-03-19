// Ez a fájl a mobilalkalmazás képernyői közti gyors váltást biztosító, görgethető választót jeleníti meg.
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { mobilKepernyoSorrend, funkcionalisKepernyok } from '../adatok/kepernyok';
import type { MobilKepernyoAzonosito } from '../tipusok/kepernyok';

const alapCimek: Record<Extract<MobilKepernyoAzonosito, 'bejelentkezes' | 'fokepernyo' | 'ertesitesek'>, string> = {
  bejelentkezes: 'Bejelentkezés',
  fokepernyo: 'Főképernyő',
  ertesitesek: 'Értesítések',
};

type KepernyoValasztoTulajdonsagok = {
  aktivKepernyo: MobilKepernyoAzonosito;
  kepernyoValasztas: (kepernyo: MobilKepernyoAzonosito) => void;
};

function kepernyoCim(kepernyo: MobilKepernyoAzonosito) {
  if (kepernyo in alapCimek) {
    return alapCimek[kepernyo as keyof typeof alapCimek];
  }

  return funkcionalisKepernyok[kepernyo as keyof typeof funkcionalisKepernyok].menuCim;
}

export function KepernyoValaszto({ aktivKepernyo, kepernyoValasztas }: KepernyoValasztoTulajdonsagok) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stilusok.tartalom}>
      {mobilKepernyoSorrend.map((kepernyo) => {
        const aktiv = kepernyo === aktivKepernyo;

        return (
          <Pressable
            key={kepernyo}
            onPress={() => kepernyoValasztas(kepernyo)}
            style={[stilusok.gomb, aktiv && stilusok.aktivGomb]}
          >
            <Text style={[stilusok.gombSzoveg, aktiv && stilusok.aktivGombSzoveg]}>{kepernyoCim(kepernyo)}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const stilusok = StyleSheet.create({
  tartalom: {
    gap: 10,
    paddingRight: 20,
  },
  gomb: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
  },
  aktivGomb: {
    backgroundColor: '#14b8a6',
    borderColor: 'rgba(45, 212, 191, 0.6)',
  },
  gombSzoveg: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
  },
  aktivGombSzoveg: {
    color: '#042f2e',
  },
});
