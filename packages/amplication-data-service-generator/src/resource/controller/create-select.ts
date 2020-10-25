import { builders, namedTypes } from "ast-types";
import { isOneToOneRelationField } from "../../util/field";
import { Entity } from "../../types";
import { NamedClassDeclaration } from "../../util/ast";

const SELECT_ID = builders.identifier("select");
const ID_ID = builders.identifier("id");

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
      .map((member) => {
        const field = nameToField[member.key.name];
        if (isOneToOneRelationField(field)) {
          /** @todo use where unique input fields  */
          return builders.objectProperty(
            member.key,
            builders.objectExpression([
              builders.objectProperty(
                SELECT_ID,
                builders.objectExpression([
                  builders.objectProperty(ID_ID, builders.booleanLiteral(true)),
                ])
              ),
            ])
          );
        }
        return builders.objectProperty(
          member.key,
          builders.booleanLiteral(true)
        );
      })
  );
}
