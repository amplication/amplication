const path = require("path");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
module.exports = {
  webpack: {
    configure: (config) => {
      // Remove guard against importing modules outside of `src`.
      // Needed for workspace projects.
      config.resolve.plugins = config.resolve.plugins.filter(
        (plugin) => !(plugin instanceof ModuleScopePlugin)
      );
      // Add support for importing workspace projects.
      config.resolve.plugins.push(
        new TsConfigPathsPlugin({
          configFile: path.resolve(__dirname, "tsconfig.json"),
          extensions: [".ts", ".tsx", ".js", ".jsx"],
          mainFields: ["module", "main"],
        })
      );

      // Replace include option for babel loader with exclude
      // so babel will handle workspace projects as well.
      config.module.rules.forEach((r) => {
        if (r.oneOf) {
          const babelLoader = r.oneOf.find(
            (rr) => rr.loader.indexOf("babel-loader") !== -1
          );
          babelLoader.exclude = /node_modules/;
          delete babelLoader.include;
        }
      });

      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve.alias,
            react: path.resolve("../../node_modules/react"),
          },
        },
      };
    },
  },
  jest: {
    configure: (config) => {
      config.resolver = "@nrwl/jest/plugins/resolver";
      return config;
    },
  },
};
