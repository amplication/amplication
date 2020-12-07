module.exports = {
  stories: ["../src/**/*.stories.@(ts|tsx|js|jsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: "@storybook/preset-create-react-app",
      options: {
        scriptsPackageName: "react-scripts",
      },
    },
  ],
  // Remove create-react-app restriction to only import from src to fix import
  // from icons
  webpackFinal: (webpackConfig) => {
    const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
      ({ constructor }) =>
        constructor && constructor.name === "ModuleScopePlugin"
    );

    webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
    return webpackConfig;
  },
};
