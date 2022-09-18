import { Plugin } from "@amplication/code-gen-types";

export const POSTGRESQL_PLUGIN_ID = "db-postgres";
export const MYSQL_PLUGIN_ID = "db-mysql";
export const POSTGRESQL_NPM = "@amplication/plugin-db-postgres";

export const installedPlugins: Plugin[] = [
  {
    pluginId: POSTGRESQL_PLUGIN_ID,
    npm: POSTGRESQL_NPM,
    enabled: true,
  },
];
