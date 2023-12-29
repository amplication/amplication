import { registerEnumType } from "@nestjs/graphql";

export enum EnumModuleDtoPropertyType {
  String = "String",
  Boolean = "Boolean",
  Int = "Int",
  Float = "Float",
  DateTime = "DateTime",
  Enum = "Enum",
  DTO = "DTO",
  Json = "Json",
}

registerEnumType(EnumModuleDtoPropertyType, {
  name: "EnumModuleDtoPropertyType",
});
