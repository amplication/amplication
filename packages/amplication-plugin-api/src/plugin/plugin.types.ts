import { PluginVersion } from "../pluginVersion/base/PluginVersion";
import { Plugin } from "./base/Plugin";

export interface PluginYml {
  id: string;
  name: string;
  description: string;
  repo: string;
  npm: string;
  icon: string;
  github: string;
  website: string;
  type: string;
  categories: string;
  resourceTypes: string;
  pluginId?: string;
  "dist-tags": {
    latest: string;
    beta?: string;
  };
  time: {
    created: string;
    modified: string;
  };
}

export interface PluginList {
  name: string;
  url: string;
  [key: string]: any;
}

export interface ProcessedPluginVersions extends Plugin {
  versions: PluginVersion[];
}
