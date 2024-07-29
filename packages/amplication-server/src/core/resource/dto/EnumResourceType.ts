import { registerEnumType } from "@nestjs/graphql";

export enum EnumResourceType {
  Service = "Service",
  ProjectConfiguration = "ProjectConfiguration",
  MessageBroker = "MessageBroker",
  PluginRepository = "PluginRepository",
}

registerEnumType(EnumResourceType, { name: "EnumResourceType" });
