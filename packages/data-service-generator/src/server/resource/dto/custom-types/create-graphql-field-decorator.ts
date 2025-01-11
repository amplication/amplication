import {
  EnumModuleDtoPropertyType,
  ModuleDtoProperty,
  PropertyTypeDef,
} from "@amplication/code-gen-types";
import { namedTypes } from "ast-types/gen/namedTypes";
import { builders } from "ast-types";
import { FIELD_ID } from "../nestjs-graphql.util";
import {
  BOOLEAN_ID,
  DATE_ID,
  NULLABLE_ID,
  STRING_ID,
  TRUE_LITERAL,
  NUMBER_ID,
  ENUM_ID,
} from "../create-field-class-property";
import { GRAPHQL_JSON_ID } from "../graphql-type-json.util";

/*
adds the @Field decorator to the class property
@Field(() => [EnumUserInterests], {
  nullable: true,
})
*/
export function createGraphQLFieldDecorator(
  property: ModuleDtoProperty
): namedTypes.Decorator {
  const type = builders.arrowFunctionExpression(
    [],
    createGraphQLFieldType(property)
  );
  return builders.decorator(
    builders.callExpression(
      FIELD_ID,
      property.isOptional
        ? [
            type,
            builders.objectExpression([
              builders.objectProperty(NULLABLE_ID, TRUE_LITERAL),
            ]),
          ]
        : [type]
    )
  );
}

function createGraphQLFieldType(
  property: ModuleDtoProperty
): namedTypes.Identifier | namedTypes.ArrayExpression {
  if (property.isArray) {
    const itemType = createGraphQLFieldType({ ...property, isArray: false });
    return builders.arrayExpression([itemType]);
  }

  if (property.propertyTypes.length > 1) {
    throw new Error(
      "Multiple property types for graphQL field are not supported"
    ); //@todo: add support for graphQL union type
  }

  const typeDef = property.propertyTypes[0];

  return convertTypeDefToGraphQLType(typeDef);
}

export function convertTypeDefToGraphQLType(
  typeDef: PropertyTypeDef
): namedTypes.Identifier | namedTypes.ArrayExpression {
  if (typeDef.isArray) {
    const itemType = convertTypeDefToGraphQLType({
      ...typeDef,
      isArray: false,
    });
    return builders.arrayExpression([itemType]);
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
    return GRAPHQL_JSON_ID;
  }

  if (typeDef.type === EnumModuleDtoPropertyType.Dto) {
    return builders.identifier(typeDef.dto.name);
  }
  if (typeDef.type === EnumModuleDtoPropertyType.Enum) {
    return ENUM_ID;
  }

  //@todo: complete support for enum, null, undefined
  //@todo: check if we need to add support for float and bigInt

  // if (isEnum) {
  //   const enumId = builders.identifier(createEnumName(field, entity));
  //   return enumId;
  // }
}
