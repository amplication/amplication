import { registerEnumType } from "@nestjs/graphql";

export enum EnumModuleDtoType {
  Entity = "Entity",
  CreateInput = "CreateInput",
  UpdateInput = "UpdateInput",
  WhereInput = "WhereInput",
  WhereUniqueInput = "WhereUniqueInput",
  OrderByInput = "OrderByInput",
  ListRelationFilter = "ListRelationFilter",
  CreateNestedManyInput = "CreateNestedManyInput",
  UpdateNestedManyInput = "UpdateNestedManyInput",
  DeleteArgs = "DeleteArgs",
  CountArgs = "CountArgs",
  FindManyArgs = "FindManyArgs",
  FindOneArgs = "FindOneArgs",
  CreateArgs = "CreateArgs",
  UpdateArgs = "UpdateArgs",
  Custom = "Custom",
  Enum = "Enum",
  CustomEnum = "CustomEnum",
}

registerEnumType(EnumModuleDtoType, {
  name: "EnumModuleDtoType",
});
