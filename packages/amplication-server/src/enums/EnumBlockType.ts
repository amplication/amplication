import { registerEnumType } from "@nestjs/graphql";

export enum EnumBlockType {
  ServiceSettings = "ServiceSettings",
  ProjectConfigurationSettings = "ProjectConfigurationSettings",
  Topic = "Topic",
  ServiceTopics = "ServiceTopics",
  PluginInstallation = "PluginInstallation",
  PluginOrder = "PluginOrder",
  Module = "Module",
  ModuleAction = "ModuleAction",
}

registerEnumType(EnumBlockType, { name: "EnumBlockType" });
