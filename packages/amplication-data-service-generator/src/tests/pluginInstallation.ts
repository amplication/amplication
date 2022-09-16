import { Plugin } from "@amplication/code-gen-types";

export const pluginInstallation: Plugin[] = [
  {
    pluginId: "@amplication/plugin-db-mysql",
    npm: "@amplication/plugin-db-postgres",
    enabled: true,
  },
];
