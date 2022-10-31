const CopyPlugin = require("copy-webpack-plugin");

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
  config.plugins.push(new CopyPlugin({
    patterns: [
      { from: `${__dirname}/prisma/generated/prisma-client/libquery_engine-darwin-arm64.dylib.node`, to: outputPath },
    ],
  }),);

  return config;
};