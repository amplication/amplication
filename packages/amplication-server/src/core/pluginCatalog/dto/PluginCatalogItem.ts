import { PluginCatalogItemVersion } from "./PluginCatalogItemVersion";

export class PluginCatalogItem {
  id: string;
  pluginId: string;
  name: string;
  description: string;
  repo: string;
  npm: string;
  icon: string;
  github: string;
  website: string;
  categories: string[];
  type: string;
  codeGeneratorName: string;
  taggedVersions: { [tag: string]: string };
  versions: PluginCatalogItemVersion[];
}
