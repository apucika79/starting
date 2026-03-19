// Ez a fájl a Starting mobilalkalmazás belépési pontja, és a kezdő bejelentkezési valamint főképernyős élményt jeleníti meg.
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { BelepesiKezdokartya } from './src/komponensek/BelepesiKezdokartya';
import { FokepernyoAttekintes } from './src/kepernyok/FokepernyoAttekintes';

export default function App() {
  return (
    <SafeAreaView style={stilusok.keret}>
      <StatusBar barStyle="light-content" />
      <View style={stilusok.tartalom}>
        <BelepesiKezdokartya />
        <FokepernyoAttekintes />
      </View>
    </SafeAreaView>
  );
}

const stilusok = StyleSheet.create({
  keret: {
    flex: 1,
    backgroundColor: '#020617',
  },
  tartalom: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 18,
    backgroundColor: '#020617',
  },
});
