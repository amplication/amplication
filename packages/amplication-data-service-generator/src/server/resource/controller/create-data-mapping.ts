import { namedTypes, builders } from "ast-types";
import { ExpressionKind } from "ast-types/gen/kinds";
import { isRelationField } from "../../../util/field";
import { Entity } from "../../../types";
import { NamedClassDeclaration } from "../../../util/ast";

export const CONNECT_ID = builders.identifier("connect");
export const UNDEFINED_ID = builders.identifier("undefined");

export function createDataMapping(
  entity: Entity,
  dto: NamedClassDeclaration,
  data: ExpressionKind
): ExpressionKind {
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
    return data;
  }
  return builders.objectExpression([
    builders.spreadElement(data),
    ...objectProperties.map((property) => {
      const member = builders.memberExpression(data, property.key);
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
