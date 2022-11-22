import { registerEnumType } from "@nestjs/graphql";

export enum EnumPendingChangeOriginType {
  Entity = "Entity",
  Block = "Block",
}

registerEnumType(EnumPendingChangeOriginType, {
  name: "EnumPendingChangeOriginType",
});
