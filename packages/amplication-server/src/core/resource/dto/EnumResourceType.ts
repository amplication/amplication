import { registerEnumType } from "@nestjs/graphql";

export enum EnumResourceType {
  Service = "Service",
  ProjectConfiguration = "ProjectConfiguration",
  MessageBroker = "MessageBroker",
  PluginRepository = "PluginRepository",
  ServiceTemplate = "ServiceTemplate",
  Component = "Component",
}

registerEnumType(EnumResourceType, { name: "EnumResourceType" });
