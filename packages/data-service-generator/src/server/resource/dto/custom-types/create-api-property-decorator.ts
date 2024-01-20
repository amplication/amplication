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
  const type = createApiPropertyType(property);

  return new ApiPropertyDecoratorBuilder(property.isArray, false)
    .optional(property.isOptional)
    .objectType(type)
    .build();
}

function createApiPropertyType(
  property: ModuleDtoProperty
): namedTypes.Identifier {
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
): namedTypes.Identifier {
  if (typeDef.type === EnumModuleDtoPropertyType.Boolean) {
    return BOOLEAN_ID;
  }
  if (typeDef.type === EnumModuleDtoPropertyType.DateTime) {
    return null;
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
