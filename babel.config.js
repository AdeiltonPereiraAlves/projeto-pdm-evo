module.exports = function (api) {
    api.cache(true); // ✅ mantenha true para melhor desempenho
    return {
      presets: ["babel-preset-expo"],
      plugins: [
        // plugin para variáveis de ambiente
        ["module:react-native-dotenv",
          {
            moduleName: "@env",   // importa via @env
            path: ".env",         // caminho do arquivo .env
            safe: false,          // true se quiser exigir todas as variáveis no .env.example
            allowUndefined: true, // permite undefined
          },
        ],
  
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
  