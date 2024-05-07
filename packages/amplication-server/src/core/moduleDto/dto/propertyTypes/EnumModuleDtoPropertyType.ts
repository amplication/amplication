import { registerEnumType } from "@nestjs/graphql";

export enum EnumModuleDtoPropertyType {
  String = "String",
  Boolean = "Boolean",
  Integer = "Integer",
  Float = "Float",
  DateTime = "DateTime",
  Enum = "Enum",
  Dto = "Dto",
  Json = "Json",
  Null = "Null",
  Undefined = "Undefined",
}

registerEnumType(EnumModuleDtoPropertyType, {
  name: "EnumModuleDtoPropertyType",
});
