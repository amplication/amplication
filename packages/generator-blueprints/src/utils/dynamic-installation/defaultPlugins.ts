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

const defaultPlugins: DefaultPlugin[] = [];

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
