import {
  EnumModuleDtoPropertyType,
  ModuleDtoProperty,
  PropertyTypeDef,
} from "@amplication/code-gen-types";
import { builders } from "ast-types";
import { namedTypes } from "ast-types/gen/namedTypes";
import { ApiPropertyDecoratorBuilder } from "../api-property-decorator";
import {
  BOOLEAN_ID,
  NUMBER_ID,
  STRING_ID,
} from "../create-field-class-property";

/*
adds the @Field decorator to the class property
@Field(() => [EnumUserInterests], {
  nullable: true,
})
*/
export function createApiPropertyDecorator(
  property: ModuleDtoProperty
): namedTypes.Decorator {
  const [type, isArray] = createApiPropertyType(property);

  if (type == null) return null;

  return new ApiPropertyDecoratorBuilder(property.isArray || isArray, false)
    .optional(property.isOptional)
    .objectType(type)
    .build();
}

function createApiPropertyType(
  property: ModuleDtoProperty
): [namedTypes.Identifier, boolean] {
  if (property.propertyTypes.length > 1) {
    throw new Error(
      "Multiple property types for API property decorator are not supported"
    ); //@todo: add support for API property union type
  }

  const typeDef = property.propertyTypes[0];

  return getTypeDefApiPropertyType(typeDef);
}

function getTypeDefApiPropertyType(
  typeDef: PropertyTypeDef
): [namedTypes.Identifier, boolean] {
  if (typeDef.isArray) {
    const [itemType] = getTypeDefApiPropertyType({
      ...typeDef,
      isArray: false,
    });
    return [itemType, true];
  }

  if (typeDef.type === EnumModuleDtoPropertyType.Boolean) {
    return [BOOLEAN_ID, false];
  }
  if (typeDef.type === EnumModuleDtoPropertyType.DateTime) {
    return [null, false];
  }
  if (
    typeDef.type === EnumModuleDtoPropertyType.Integer ||
    typeDef.type === EnumModuleDtoPropertyType.Float
  ) {
    return [NUMBER_ID, false];
  }

  if (typeDef.type === EnumModuleDtoPropertyType.String) {
    return [STRING_ID, false];
  }
  if (typeDef.type === EnumModuleDtoPropertyType.Json) {
    return [null, false];
  }
  if (typeDef.type === EnumModuleDtoPropertyType.Dto) {
    return [builders.identifier(typeDef.dto.name), false];
  }
  if (typeDef.type === EnumModuleDtoPropertyType.Enum) {
    return [builders.identifier(typeDef.dto.name), false];
  }

  //@todo: check if we need to add support for float and bigInt
}
