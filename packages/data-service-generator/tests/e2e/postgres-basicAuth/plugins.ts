import { PluginInstallation } from "@amplication/code-gen-types";

export const postgresAndBasicAuthPlugins: PluginInstallation[] = [
  {
    id: "postgres-id",
    pluginId: "plugin-db-postgres",
    npm: "@amplication/plugin-db-postgres",
    enabled: true,
    version: "latest",
  },
  {
    id: "auth-core-id",
    pluginId: "auth-core",
    npm: "@amplication/plugin-auth-core",
    enabled: true,
    version: "latest",
  },
  {
    id: "auth-basic-id",
    pluginId: "auth-basic",
    npm: "@amplication/plugin-auth-basic",
    enabled: true,
    version: "latest",
  },
];
