import { PluginData } from "./plugin.types";

export const AMPLICATION_GITHUB_URL =
  "https://api.github.com/repos/amplication/plugin-catalog/contents/plugins";
export const emptyPlugin: PluginData = {
  plugin: {
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
  },
  npm: {
    "dist-tags": {},
    time: {
      modified: "",
      created: "",
    },
  },
  downloads: 0,
};
