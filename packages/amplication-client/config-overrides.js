/**
 * Override Create React App Webpack configuration
 * This file is being used by react-app-rewired
 * @see https://github.com/timarney/react-app-rewired
 */

const path = require("path");
const { set } = require("lodash");
const designSystemPkg = require("@amplication/design-system/package.json");

module.exports = function override(config, env) {
  /**
   * Force Webpack to resolve peer dependencies to the version in node_modules top level
   * This has to be done because, correct to November 2020, when using Lerna
   * with npm Webpack sees peer dependencies in @amplication/design-system as
   * different packages (even if their versions match)
   * @see https://stackoverflow.com/a/31170775/5798553
   */
  for (const peerDependency of Object.keys(designSystemPkg.peerDependencies)) {
    aliasDependencyToTopLevel(config, peerDependency);
  }
  return config;
};

function aliasDependencyToTopLevel(config, dependency) {
  set(
    config,
    ["resolve", "alias", dependency],
    path.resolve(`./node_modules/${dependency}`)
  );
}
