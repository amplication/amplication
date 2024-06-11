import { PluginVersion } from "../pluginVersion/base/PluginVersion";
import { Plugin } from "./base/Plugin";

export interface NpmTags {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "dist-tags"?: { [key: string]: string };
  time?: { modified: string; created: string };
}

export interface NpmDownloads {
  downloads: number;
}

export interface PluginData {
  pluginCatalogEntry: PluginCatalogEntryYml;
  npm: NpmTags;
  downloads: number;
}

export interface PluginCatalogEntryYml {
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
  generator: string[] | string;
}

export interface PluginList {
  name: string;
  url: string;
  [key: string]: any;
}

export interface ProcessedPluginVersions extends Plugin {
  versions: PluginVersion[];
}
