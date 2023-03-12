import { PluginInstallation } from "@amplication/code-gen-types";
export const POSTGRESQL_PLUGIN_ID = "db-postgres";
export const MYSQL_PLUGIN_ID = "db-mysql";
export const POSTGRESQL_NPM = "@amplication/plugin-db-postgres";
export const MONGO_PLUGIN_ID = "db-mongo";
type DefaultPlugin = {
  categoryPluginIds: string[];
  defaultCategoryPlugin: PluginInstallation;
};

const defaultPlugins: DefaultPlugin[] = [
  {
    categoryPluginIds: [POSTGRESQL_PLUGIN_ID, MYSQL_PLUGIN_ID, MONGO_PLUGIN_ID],
    defaultCategoryPlugin: {
      id: "placeholder-id",
      pluginId: POSTGRESQL_PLUGIN_ID,
      npm: POSTGRESQL_NPM,
      enabled: true,
      version: "latest",
    },
  },
  {
    categoryPluginIds: ["lusha"],
    defaultCategoryPlugin: {
      id: "pclb3p3ov800cplc01a8f6uwje",
      pluginId: "lusha",
      npm: "@amplication/lusha",
      enabled: true,
      version: "0.0.1-beta.45",
      settings: { local: true, destPath: "../../../plugins/plugins/lusha" },
    },
  },
];

export function prepareDefaultPlugins(
  installedPlugins: PluginInstallation[]
): PluginInstallation[] {
  const missingDefaultPlugins = defaultPlugins.flatMap((pluginCategory) => {
    let pluginFound = false;
    pluginCategory.categoryPluginIds.forEach((pluginId) => {
      if (!pluginFound) {
        pluginFound = installedPlugins.some(
          (installedPlugin) => installedPlugin.pluginId === pluginId
        );
      }
    });
    if (!pluginFound) return [pluginCategory.defaultCategoryPlugin];

    return [];
  });
  return [...missingDefaultPlugins, ...installedPlugins];
}
