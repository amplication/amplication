const GeneratePackageJsonPlugin = require("generate-package-json-webpack-plugin");
const path = require("path");
const packageJson = require("../../package.json");

/**
 * Extend the default Webpack configuration from nx / ng.
 */
module.exports = (config, context) => {
  // Extract output path from context
  const {
    options: { outputPath },
  } = context;

  // Install additional plugins
  config.plugins = config.plugins || [];
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
  return [generatePackageJson()];
}

/**
 * Generate a package.json file that contains only the dependencies which are actually
 * used in the code.
 *
 * @returns {*} A Webpack plugin
 */
function generatePackageJson() {
  const implicitDeps = [
    "class-transformer",
    "class-validator",
    "@nestjs/platform-express",
    "reflect-metadata",
    "prisma",
    "kafkajs",
  ];
  const dependencies = implicitDeps.reduce((acc, dep) => {
    acc[dep] = packageJson.dependencies[dep];
    return acc;
  }, {});
  const basePackageJson = {
    dependencies,
  };
  const pathToPackageJson = path.join(__dirname, "../../", "package.json");
  return new GeneratePackageJsonPlugin(basePackageJson, {
    sourcePackageFilenames: [pathToPackageJson],
  });
}
