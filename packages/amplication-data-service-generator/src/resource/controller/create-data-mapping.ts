import { namedTypes, builders } from "ast-types";
import { isRelationField } from "../../util/field";
import { Entity } from "../../types";
import { NamedClassDeclaration } from "../../util/ast";

export const DATA_ID = builders.identifier("data");
export const CONNECT_ID = builders.identifier("connect");

export function createDataMapping(
  entity: Entity,
  dto: NamedClassDeclaration
): namedTypes.Identifier | namedTypes.ObjectExpression {
  const relationFieldNames = new Set(
    entity.fields
      .filter((field) => isRelationField(field))
      .map((field) => field.name)
  );
  const objectProperties = dto.body.body.filter(
    (member): member is namedTypes.ClassProperty =>
      namedTypes.ClassProperty.check(member) &&
      namedTypes.Identifier.check(member.key) &&
      relationFieldNames.has(member.key.name)
  );
  if (!objectProperties.length) {
    return DATA_ID;
  }
  return builders.objectExpression([
    builders.spreadElement(DATA_ID),
    ...objectProperties.map((property) =>
      builders.property(
        "init",
        property.key,
        builders.objectExpression([
          builders.property(
            "init",
            CONNECT_ID,
            builders.memberExpression(DATA_ID, property.key)
          ),
        ])
      )
    ),
  ]);
}
