const path = require("path");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const { set } = require("lodash");
const designSystemPkg = require("../amplication-design-system/package.json");

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

      /**
       * Force Webpack to resolve peer dependencies to the version in node_modules top level
       * This has to be done because, correct to November 2020, when using Lerna
       * with npm Webpack sees peer dependencies in @amplication/design-system as
       * different packages (even if their versions match)
       * @see https://stackoverflow.com/a/31170775/5798553
       */
      for (const peerDependency of Object.keys(
        designSystemPkg.peerDependencies
      )) {
        aliasDependencyToTopLevel(config, peerDependency);
      }

      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve.alias,
            react: path.resolve("../../node_modules/react"),
            "react-dom": path.resolve("../../node_modules/react-dom"),
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

function aliasDependencyToTopLevel(config, dependency) {
  set(
    config,
    ["resolve", "alias", dependency],
    path.resolve(`./node_modules/${dependency}`)
  );
}
