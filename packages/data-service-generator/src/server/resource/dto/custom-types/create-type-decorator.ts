import {
  EnumModuleDtoPropertyType,
  ModuleDtoProperty,
  PropertyTypeDef,
} from "@amplication/code-gen-types";
import { builders } from "ast-types";
import { namedTypes } from "ast-types/gen/namedTypes";
import * as classTransformerUtil from "../class-transformer.util";
import {
  BOOLEAN_ID,
  DATE_ID,
  NUMBER_ID,
  STRING_ID,
} from "../create-field-class-property";

export function createTypeDecorator(
  property: ModuleDtoProperty
): namedTypes.Decorator {
  const type = createType(property);
  if (type == null) return null;

  return builders.decorator(
    builders.callExpression(classTransformerUtil.TYPE_ID, [
      builders.arrowFunctionExpression([], type),
    ])
  );
}

function createType(
  property: ModuleDtoProperty
): namedTypes.Identifier | namedTypes.ArrayExpression {
  if (property.isArray) {
    //@type decorator from class-transformer expects the inner type of the array
    return createType({ ...property, isArray: false });
  }

  if (property.propertyTypes.length > 1) {
    throw new Error(
      "Multiple property types for graphQL field are not supported"
    ); //@todo: add support for graphQL union type
  }

  const typeDef = property.propertyTypes[0];

  return createTypeFromTypeDef(typeDef);
}

export function createTypeFromTypeDef(
  typeDef: PropertyTypeDef
): namedTypes.Identifier | namedTypes.ArrayExpression {
  if (typeDef.isArray) {
    //@type decorator from class-transformer expects the inner type of the array
    return createTypeFromTypeDef({ ...typeDef, isArray: false });
  }

  if (typeDef.type === EnumModuleDtoPropertyType.Boolean) {
    return BOOLEAN_ID;
  }
  if (typeDef.type === EnumModuleDtoPropertyType.DateTime) {
    return DATE_ID;
  }
  if (
    typeDef.type === EnumModuleDtoPropertyType.Integer ||
    typeDef.type === EnumModuleDtoPropertyType.Float
  ) {
    return NUMBER_ID;
  }

  if (typeDef.type === EnumModuleDtoPropertyType.String) {
    return STRING_ID;
  }
  if (typeDef.type === EnumModuleDtoPropertyType.Json) {
    return null;
  }
  if (typeDef.type === EnumModuleDtoPropertyType.Dto) {
    return builders.identifier(typeDef.dto.name);
  }

  //@todo: complete support for enum, null, undefined
  //@todo: check if we need to add support for float and bigInt

  // if (isEnum) {
  //   const enumId = builders.identifier(createEnumName(field, entity));
  //   return enumId;
  // }
}
