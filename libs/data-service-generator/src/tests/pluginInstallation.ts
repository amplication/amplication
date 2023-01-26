import { PluginInstallation } from "@amplication/code-gen-types";
import { plugins } from "./constants/example-plugins";
export const installedPlugins: PluginInstallation[] = [
  plugins.postgresPlugin,
  {
    id: "clb3p3t7z0098jn015na6ork3",
    npm: "@amplication/plugin-auth",
    enabled: true,
    version: "latest",
    pluginId: "auth-api",
    settings: {},
  },
];
