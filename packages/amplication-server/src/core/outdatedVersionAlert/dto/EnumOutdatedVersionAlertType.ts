import { registerEnumType } from "@nestjs/graphql";

export enum EnumOutdatedVersionAlertType {
  TemplateVersion = "TemplateVersion",
  PluginVersion = "PluginVersion",
  CodeEngineVersion = "CodeEngineVersion",
}

registerEnumType(EnumOutdatedVersionAlertType, {
  name: "EnumOutdatedVersionAlertType",
});
