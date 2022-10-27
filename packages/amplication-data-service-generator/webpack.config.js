const CopyPlugin = require("copy-webpack-plugin");
const GeneratePackageJsonPlugin = require("generate-package-json-webpack-plugin");
const path = require("path");
const packageJson = require("./package.json");

/**
 * Extend the default Webpack configuration from nx / ng.
 */
module.exports = (config, context) => {
  config.plugins = config.plugins || [];

  // This is required for the dynamic import of plugins in register-plugin.ts
  // https://stackoverflow.com/questions/60494700/critical-dependency-the-request-of-a-dependency-is-an-expression-vue-js
  config.module.exprContextCritical = false;

  // This is required for the inclusion of static/template files that should not be type-checked.
  // They are seen as "static source files".
  config.module.rules.push(
    {
      test: /\.?static\/*.*?$/,
      type: "asset/source",
    },
    {
      test: /\.?template.*?$/,
      type: "asset/source",
    },
    {
      test: /\.?base.*?$/,
      type: "asset/source",
    }
  );

  const {
    options: { outputPath },
  } = context;

  config.plugins.push(...extractRelevantNodeModules(outputPath));

  return config;
};

/**
 * This repository only contains one single package.json file that lists the dependencies
 * of all its frontend and backend applications. When a frontend application is built,
 * its external dependencies (aka Node modules) are bundled in the resulting artifact.
 * However, it is not the case for a backend application (for various valid reasons).
 * Installing all the production dependencies would dramatically increase the size of the
 * artifact. Instead, we need to extract the dependencies which are actually used by the
 * backend application. We have implemented this behavior by complementing the default
 * Webpack configuration with additional plugins.
 *
 * @param {String} outputPath The path to the bundle being built
 * @returns {Array} An array of Webpack plugins
 */
function extractRelevantNodeModules(outputPath) {
  return [copyPackageLockFile(outputPath), generatePackageJson()];
}

/**
 * Copy the Yarn lock file to the bundle to make sure that the right dependencies are
 * installed when running `yarn install`.
 *
 * @param {String} outputPath The path to the bundle being built
 * @returns {*} A Webpack plugin
 */
function copyPackageLockFile(outputPath) {
  return new CopyPlugin({
    patterns: [
      {
        from: "package-lock.json",
        to: path.join(outputPath, "package-lock.json"),
      },
    ],
  });
}

/**
 * Generate a package.json file that contains only the dependencies which are actually
 * used in the code.
 *
 * @returns {*} A Webpack plugin
 */
function generatePackageJson() {
  const basePackageJson = {
    scripts: packageJson.scripts,
    dependencies: packageJson.dependencies,
    devDependencies: packageJson.devDependencies,
  };
  const pathToPackageJson = path.join(__dirname, "./", "package.json");
  return new GeneratePackageJsonPlugin(basePackageJson, {
    excludeDependencies: ["@amplication/prisma-clients"],
    sourcePackageFilenames: [pathToPackageJson],
  });
}
