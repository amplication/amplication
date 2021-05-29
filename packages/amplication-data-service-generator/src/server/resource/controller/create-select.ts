import { builders, namedTypes } from "ast-types";
import {
  isOneToOneRelationField,
  isToManyRelationField,
} from "../../../util/field";
import { Entity } from "../../../types";
import { NamedClassDeclaration } from "../../../util/ast";

export const SELECT_ID = builders.identifier("select");
export const ID_ID = builders.identifier("id");
export const TRUE_BOOLEAN_LITERAL = builders.booleanLiteral(true);

export function createSelect(
  entityDTO: NamedClassDeclaration,
  entity: Entity
): namedTypes.ObjectExpression {
  const nameToField = Object.fromEntries(
    entity.fields.map((field) => [field.name, field])
  );
  return builders.objectExpression(
    entityDTO.body.body
      .filter(
        (
          member
        ): member is namedTypes.ClassProperty & {
          key: namedTypes.Identifier;
        } =>
          namedTypes.ClassProperty.check(member) &&
          namedTypes.Identifier.check(member.key) &&
          member.key.name in nameToField
      )
      .flatMap((member) => {
        const field = nameToField[member.key.name];

        if (isToManyRelationField(field)) {
          return [];
        }

        if (isOneToOneRelationField(field)) {
          /** @todo use where unique input fields  */
          return [
            createObjectSelectProperty(member.key, [
              createSelectProperty(ID_ID),
            ]),
          ];
        }
        return [createSelectProperty(member.key)];
      })
  );
}

export function createSelectProperty(
  key: namedTypes.Identifier
): namedTypes.ObjectProperty {
  return builders.objectProperty(key, TRUE_BOOLEAN_LITERAL);
}

export function createObjectSelectProperty(
  key: namedTypes.Identifier,
  properties: namedTypes.ObjectProperty[]
): namedTypes.ObjectProperty {
  return builders.objectProperty(
    key,
    builders.objectExpression([
      builders.objectProperty(SELECT_ID, builders.objectExpression(properties)),
    ])
  );
}
