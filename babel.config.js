module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          // This has to be mirrored in tsconfig.json
          "@components": "./src/components",
          "@navigations": "./src/navigations",
          "@assets": "./src/assets",
          "@screens": "./src/screens",
          "@utils": "./src/utils",
          "@constants": "./src/constants",
          "@models": "./src/models",
          "@hooks": "./src/hooks",
          "@locales": "./src/locales",
          "@redux": "./src/store/redux",
          "@services": "./src/services",
          "@store": "./src/store",
          "@contexts": "./src/contexts",
        },
      },
    ],
  ],
};
