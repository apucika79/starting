// Ez a fájl a Starting mobilalkalmazás Babel beállítását tartalmazza Expo futtatáshoz.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
