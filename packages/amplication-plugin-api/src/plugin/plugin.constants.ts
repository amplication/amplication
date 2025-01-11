/* eslint-disable @typescript-eslint/naming-convention */
import { PluginData } from "./plugin.types";

export const AMPLICATION_GITHUB_URL =
  "https://api.github.com/repos/amplication/plugin-catalog/contents/plugins";

export const NPM_DOWNLOADS_API = "https://api.npmjs.org/downloads/point/";

export const emptyPlugin: PluginData = {
  pluginCatalogEntry: {
    id: "",
    name: "",
    description: "",
    repo: "",
    npm: "",
    icon: "",
    github: "",
    website: "",
    type: "",
    categories: "[]",
    resourceTypes: "",
    pluginId: "",
    generator: [""],
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
