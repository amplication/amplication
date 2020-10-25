import { builders, namedTypes } from "ast-types";
import { NamedClassDeclaration } from "../../util/ast";

export function createSelect(
  entityDTO: NamedClassDeclaration
): namedTypes.ObjectExpression {
  return builders.objectExpression(
    entityDTO.body.body
      .filter((member): member is namedTypes.ClassProperty =>
        namedTypes.ClassProperty.check(member)
      )
      .map((member) =>
        builders.objectProperty(member.key, builders.booleanLiteral(true))
      )
  );
}
