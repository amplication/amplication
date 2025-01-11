import {
  EnumModuleDtoPropertyType,
  EnumModuleDtoType,
  ModuleDtoProperty,
  PropertyTypeDef,
} from "@amplication/code-gen-types";
import { builders } from "ast-types";
import { namedTypes } from "ast-types/gen/namedTypes";
import { ApiPropertyDecoratorBuilder } from "../api-property-decorator";
import {
  BOOLEAN_ID,
  ENUM_ID,
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
  const [type, isArray, isEnum] = createApiPropertyType(property);

  if (type == null) return null;

  const builder = new ApiPropertyDecoratorBuilder(
    property.isArray || isArray,
    false
  ).optional(property.isOptional);

  if (isEnum) {
    builder.enum(type);
  } else {
    builder.objectType(type);
  }

  return builder.build();
}

function createApiPropertyType(
  property: ModuleDtoProperty
): [namedTypes.Identifier, boolean, boolean] {
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
): [namedTypes.Identifier, boolean, boolean] {
  if (typeDef.isArray) {
    const [itemType, , isEnum] = getTypeDefApiPropertyType({
      ...typeDef,
      isArray: false,
    });
    return [itemType, true, isEnum];
  }

  if (typeDef.type === EnumModuleDtoPropertyType.Boolean) {
    return [BOOLEAN_ID, false, false];
  }
  if (typeDef.type === EnumModuleDtoPropertyType.DateTime) {
    return [null, false, false];
  }
  if (
    typeDef.type === EnumModuleDtoPropertyType.Integer ||
    typeDef.type === EnumModuleDtoPropertyType.Float
  ) {
    return [NUMBER_ID, false, false];
  }

  if (typeDef.type === EnumModuleDtoPropertyType.String) {
    return [STRING_ID, false, false];
  }
  if (typeDef.type === EnumModuleDtoPropertyType.Json) {
    return [null, false, false];
  }
  if (typeDef.type === EnumModuleDtoPropertyType.Dto) {
    if (
      typeDef.dto.dtoType === EnumModuleDtoType.CustomEnum ||
      typeDef.dto.dtoType === EnumModuleDtoType.Enum
    ) {
      return [builders.identifier(typeDef.dto.name), false, true];
    }
    return [builders.identifier(typeDef.dto.name), false, false];
  }
  if (typeDef.type === EnumModuleDtoPropertyType.Enum) {
    return [ENUM_ID, false, false];
  }

  //@todo: check if we need to add support for float and bigInt
}
