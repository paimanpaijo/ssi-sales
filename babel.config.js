/** @format */

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./", // ✅ ini penting
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
