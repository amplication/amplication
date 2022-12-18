import { builders, namedTypes } from "ast-types";
import {
  Entity,
  EnumDataType,
  types,
  NamedClassDeclaration,
} from "@amplication/code-gen-types";
import { readFile } from "../../../../../util/module";
import {
  interpolate,
  getClassDeclarationById,
  classProperty,
} from "../../../../../util/ast";
import { API_PROPERTY_ID } from "../../nestjs-swagger.util";
import { FIELD_ID } from "../../nestjs-graphql.util";
import {
  TRUE_LITERAL,
  NULLABLE_ID,
  REQUIRED_ID,
  ENUM_ID,
} from "../../create-field-class-property";
import {
  SORT_ORDER_ID,
  SORT_ORDER_DESC_LITERAL,
  SORT_ORDER_ASC_LITERAL,
} from "../../sort-order.util";

const templatePath = require.resolve("./order-by-input.template.ts");

export async function createOrderByInput(
  entity: Entity
): Promise<NamedClassDeclaration> {
  const file = await readFile(templatePath);
  const id = createOrderByInputId(entity.name);

  interpolate(file, {
    ID: id,
  });

  const classDeclaration = getClassDeclarationById(file, id);

  const typeAnnotation = builders.tsTypeAnnotation(
    builders.tsTypeReference(SORT_ORDER_ID)
  );

  const enumOptions = builders.arrayExpression([
    SORT_ORDER_ASC_LITERAL,
    SORT_ORDER_DESC_LITERAL,
  ]);

  const apiPropertyOptionsObjectExpression = builders.objectExpression([
    builders.objectProperty(REQUIRED_ID, builders.booleanLiteral(false)),
    builders.objectProperty(ENUM_ID, enumOptions),
  ]);
  const decorators: namedTypes.Decorator[] = [
    builders.decorator(
      builders.callExpression(API_PROPERTY_ID, [
        apiPropertyOptionsObjectExpression,
      ])
    ),
    createGraphQLFieldDecorator(),
  ];

  const properties = entity.fields.flatMap((field) => {
    let propertyName = field.name;

    if (field.dataType === EnumDataType.Lookup) {
      const fieldProperties = field.properties as types.Lookup;
      if (!fieldProperties.allowMultipleSelection) {
        propertyName = `${field.name}Id`;
      } else {
        return [];
      }
    }

    const id = builders.identifier(propertyName);

    return [classProperty(id, typeAnnotation, false, true, null, decorators)];
  });

  classDeclaration.body = builders.classBody(properties);

  return classDeclaration as NamedClassDeclaration;
}

function createGraphQLFieldDecorator(): namedTypes.Decorator {
  const type = builders.arrowFunctionExpression([], SORT_ORDER_ID);
  return builders.decorator(
    builders.callExpression(FIELD_ID, [
      type,
      builders.objectExpression([
        builders.objectProperty(NULLABLE_ID, TRUE_LITERAL),
      ]),
    ])
  );
}

export function createOrderByInputId(
  entityType: string
): namedTypes.Identifier {
  return builders.identifier(`${entityType}OrderByInput`);
}
