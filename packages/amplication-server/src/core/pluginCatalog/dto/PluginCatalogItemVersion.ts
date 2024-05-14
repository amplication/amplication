import { JsonValue } from "type-fest";

export class PluginCatalogItemVersion {
  version: string;
  isLatest: boolean;
  settings: JsonValue;
  configurations: JsonValue;
  id: string;
  pluginId: string;
}
