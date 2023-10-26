const { composePlugins, withNx } = require("@nx/webpack");
const { withReact } = require("@nx/react");

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  const miniCssExtractPlugin = config.plugins.find(
    (plugin) => plugin.constructor.name === "MiniCssExtractPlugin"
  );
  if (miniCssExtractPlugin) {
    miniCssExtractPlugin.options.ignoreOrder = true;
  }
  config.ignoreWarnings = [
    /(Failed to parse source map from)\s.*\/node_modules\/.*/,
  ];

  return config;
});
