import { namedTypes, builders } from "ast-types";
import { isRelationField } from "../../util/field";
import { Entity } from "../../types";
import { NamedClassDeclaration } from "../../util/ast";

export const DATA_ID = builders.identifier("data");
export const CONNECT_ID = builders.identifier("connect");
export const UNDEFINED_ID = builders.identifier("undefined");

export function createDataMapping(
  entity: Entity,
  dto: NamedClassDeclaration
): namedTypes.Identifier | namedTypes.ObjectExpression {
  const relationFields = entity.fields.filter((field) =>
    isRelationField(field)
  );
  const relationFieldNames = new Set(relationFields.map((field) => field.name));
  const optionalRelationFieldNames = new Set(
    relationFields.filter((field) => !field.required).map((field) => field.name)
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
    ...objectProperties.map((property) => {
      const member = builders.memberExpression(DATA_ID, property.key);
      const connect = builders.objectExpression([
        builders.property("init", CONNECT_ID, member),
      ]);
      const value =
        namedTypes.Identifier.check(property.key) &&
        optionalRelationFieldNames.has(property.key.name)
          ? builders.conditionalExpression(member, connect, UNDEFINED_ID)
          : connect;
      return builders.property("init", property.key, value);
    }),
  ]);
}
