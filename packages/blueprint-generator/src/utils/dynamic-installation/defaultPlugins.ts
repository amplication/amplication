import { PluginInstallation } from "@amplication/code-gen-types";
export const MSSQL_PLUGIN_NPM = "@amplication/plugin-dotnet-db-sqlserver";
export const MSSQL_PLUGIN_ID = "dotnet-db-sqlserver";
export const POSTGRESQL_PLUGIN_ID = "dotnet-db-postgres";
export const MYSQL_PLUGIN_ID = "dotnet-db-mysql";
export const MONGO_PLUGIN_ID = "dotnet-db-mongo";

type DefaultPlugin = {
  categoryPluginIds: string[];
  defaultCategoryPlugin: PluginInstallation;
};

const defaultPlugins: DefaultPlugin[] = [
  {
    categoryPluginIds: [
      POSTGRESQL_PLUGIN_ID,
      MYSQL_PLUGIN_ID,
      MONGO_PLUGIN_ID,
      MSSQL_PLUGIN_ID,
    ],
    defaultCategoryPlugin: {
      id: "placeholder-id",
      pluginId: MSSQL_PLUGIN_ID,
      npm: MSSQL_PLUGIN_NPM,
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
