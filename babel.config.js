module.exports = function (api) {
    api.cache(true); // ✅ mantenha true para melhor desempenho
    return {
      presets: ["babel-preset-expo"],
      plugins: [
        // plugin para variáveis de ambiente
        ["module:react-native-dotenv"],
  
        // plugin para usar alias (@)
        [
          "module-resolver",
          {
            root: ["./src"],
            alias: {
              "@": "./src",
            },
          },
        ],
      ],
    };
  };
  