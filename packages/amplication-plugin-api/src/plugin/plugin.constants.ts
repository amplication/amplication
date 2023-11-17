import { PluginYml } from "./plugin.types";

export const AMPLICATION_GITHUB_URL =
  "https://api.github.com/repos/amplication/plugin-catalog/contents/plugins";
export const emptyPlugin: PluginYml = {
  id: "",
  name: "",
  description: "",
  repo: "",
  npm: "",
  icon: "",
  github: "",
  website: "",
  type: "",
  categories: "",
  resourceTypes: "",
  pluginId: "",
};
