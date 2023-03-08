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
