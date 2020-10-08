import { namedTypes, builders } from "ast-types";
import { NamedClassDeclaration } from "../../util/ast";

const DATA_ID = builders.identifier("data");
const CONNECT_ID = builders.identifier("connect");

export function createDataMapping(
  dto: NamedClassDeclaration
): namedTypes.Identifier | namedTypes.ObjectExpression {
  const objectProperties = dto.body.body.filter(
    (member): member is namedTypes.ClassProperty =>
      namedTypes.ClassProperty.check(member) &&
      // Assuming every type reference is a reference to an object type
      namedTypes.TSTypeReference.check(member.typeAnnotation?.typeAnnotation)
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
