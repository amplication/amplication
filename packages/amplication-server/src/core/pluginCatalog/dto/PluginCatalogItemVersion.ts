export class PluginCatalogItemVersion {
  version: string;
  isLatest: boolean;
  settings: Record<string, unknown>;
  configurations: string;
  id: string;
  pluginId: string;
}
