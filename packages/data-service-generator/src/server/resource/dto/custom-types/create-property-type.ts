import {
  EnumModuleDtoPropertyType,
  EnumModuleDtoType,
  PropertyTypeDef,
} from "@amplication/code-gen-types";
import { builders } from "ast-types";
import { TSTypeKind } from "ast-types/gen/kinds";
import { INPUT_JSON_VALUE_KEY } from "../constants";
import {
  StringLiteralEnumMember,
  createEnumMemberName,
} from "../create-enum-dto";

export const DATE_ID = builders.identifier("Date");

const TYPE_DEF_TO_TYPE: {
  [key in EnumModuleDtoPropertyType]: TSTypeKind;
} = {
  [EnumModuleDtoPropertyType.Boolean]: builders.tsBooleanKeyword(),
  [EnumModuleDtoPropertyType.DateTime]: builders.tsTypeReference(DATE_ID),
  [EnumModuleDtoPropertyType.Float]: builders.tsNumberKeyword(),
  [EnumModuleDtoPropertyType.Integer]: builders.tsNumberKeyword(),
  [EnumModuleDtoPropertyType.String]: builders.tsStringKeyword(),
  [EnumModuleDtoPropertyType.Json]: builders.tsTypeReference(
    builders.identifier(INPUT_JSON_VALUE_KEY)
  ),
  [EnumModuleDtoPropertyType.Dto]: undefined,
  [EnumModuleDtoPropertyType.Enum]: undefined,
  [EnumModuleDtoPropertyType.Null]: builders.tsNullKeyword(),
  [EnumModuleDtoPropertyType.Undefined]: builders.tsUndefinedKeyword(),
};

export const EACH_ID = builders.identifier("each");
export const TRUE_LITERAL = builders.booleanLiteral(true);
export const ENUM = "enum";
export const ENUM_ID = builders.identifier(ENUM);
export const REQUIRED = "required";
export const REQUIRED_ID = builders.identifier(REQUIRED);
export const TYPE = "type";
export const TYPE_ID = builders.identifier(TYPE);
export const JSON_ID = builders.identifier("JSON");
export const PARSE_ID = builders.identifier("parse");
export const IS_ARRAY_ID = builders.identifier("isArray");
export const NULLABLE_ID = builders.identifier("nullable");

export function createPropTypeFromTypeDefList(
  typeDefs: PropertyTypeDef[]
): TSTypeKind {
  const types = typeDefs.map((typeDef) => createPropTypeFromTypeDef(typeDef));

  if (types?.length > 1) {
    return builders.tsUnionType(types);
  }

  return types[0];
}

export function createPropTypeFromTypeDef(
  typeDef: PropertyTypeDef
): TSTypeKind {
  let baseType: TSTypeKind;

  if (typeDef.type === EnumModuleDtoPropertyType.Dto) {
    if (!typeDef.dto) {
      throw new Error(
        `Property with type "DTO" and dtoId "${typeDef.dtoId}" is missing reference to the referenced DTO}`
      );
    }
    baseType = builders.tsTypeReference(builders.identifier(typeDef.dto.name));

    if (typeDef.dto.dtoType === EnumModuleDtoType.CustomEnum) {
      const members = typeDef.dto.members.map(
        (member) =>
          builders.tsEnumMember(
            builders.identifier(createEnumMemberName(member.name)),
            builders.stringLiteral(member.value)
          ) as StringLiteralEnumMember
      );

      baseType = builders.tsUnionType(
        members.map((member) => builders.tsLiteralType(member.initializer))
      );
    }
  } else {
    baseType = TYPE_DEF_TO_TYPE[typeDef.type];
  }

  if (typeDef.isArray) {
    return builders.tsArrayType(baseType);
  }

  return baseType;
}
