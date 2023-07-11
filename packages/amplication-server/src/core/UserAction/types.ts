import { registerEnumType } from "@nestjs/graphql";

export enum EnumUserActionType {
  DBSchemaImport = "DBSchemaImport",
}

registerEnumType(EnumUserActionType, {
  name: "EnumUserActionType",
});

export enum EnumUserActionStatus {
  Running = "Running",
  Completed = "Completed",
  Failed = "Failed",
  Invalid = "Invalid",
}

registerEnumType(EnumUserActionStatus, {
  name: "EnumUserActionStatus",
});
