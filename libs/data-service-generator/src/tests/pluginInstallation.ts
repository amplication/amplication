import { PluginInstallation } from "@amplication/code-gen-types";
import { plugins } from "./constants/example-plugins";
export const installedPlugins: PluginInstallation[] = [
  plugins.postgresPlugin,
  {
    id: "auth-api",
    enabled: true,
    version: "0.0.1",
    pluginId: "pluginId",
    npm: "@amplication/plugin-auth",
  },
];
