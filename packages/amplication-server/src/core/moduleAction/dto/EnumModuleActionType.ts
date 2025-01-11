import { registerEnumType } from "@nestjs/graphql";

export enum EnumModuleActionType {
  Meta = "Meta",
  Create = "Create",
  Read = "Read",
  Update = "Update",
  Delete = "Delete",
  Find = "Find",
  ParentGet = "ParentGet",
  ChildrenFind = "ChildrenFind",
  ChildrenConnect = "ChildrenConnect",
  ChildrenDisconnect = "ChildrenDisconnect",
  ChildrenUpdate = "ChildrenUpdate",

  Custom = "Custom",
}

registerEnumType(EnumModuleActionType, { name: "EnumModuleActionType" });
