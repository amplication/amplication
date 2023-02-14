import { PluginInstallation } from "@amplication/code-gen-types";
import { plugins } from "./constants/example-plugins";
export const installedPlugins: PluginInstallation[] = [
  plugins.postgresPlugin,
  {
    id: "placeholder-id",
    pluginId: "auth-core",
    npm: "@amplication/plugin-auth-core",
    enabled: true,
    version: "1.0.1",
  },
];
