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
  ModuleDto = "ModuleDto",
  Package = "Package",
  PrivatePlugin = "PrivatePlugin",
  CodeEngineVersion = "CodeEngineVersion",
  Relation = "Relation",
  ResourceSettings = "ResourceSettings",
}

registerEnumType(EnumBlockType, { name: "EnumBlockType" });
