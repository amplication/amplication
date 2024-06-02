import { registerEnumType } from "@nestjs/graphql";

export enum EnumResourceType {
  Service = "Service",
  ProjectConfiguration = "ProjectConfiguration",
  MessageBroker = "MessageBroker",
}

registerEnumType(EnumResourceType, { name: "EnumResourceType" });
