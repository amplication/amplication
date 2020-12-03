import { builders, namedTypes } from "ast-types";
import { ExpressionKind } from "ast-types/gen/kinds";
import { EntityField } from "../../types";

const JSON_ID = builders.identifier("JSON");
const STRINGIFY_ID = builders.identifier("stringify");

/**
 * Creates a node for displaying given entity field value
 * @param field the entity field to create value view for
 * @returns the node AST representation
 */
export function createFieldValue(
  field: EntityField,
  dataId: namedTypes.Identifier
): namedTypes.JSXFragment {
  return builders.jsxFragment(
    builders.jsxOpeningFragment(),
    builders.jsxClosingFragment(),
    [
      builders.jsxExpressionContainer(
        createJSONStringifyCallExpression([
          builders.memberExpression(dataId, builders.identifier(field.name)),
        ])
      ),
    ]
  );
}

function createJSONStringifyCallExpression(
  args: ExpressionKind[]
): namedTypes.CallExpression {
  return builders.callExpression(
    builders.memberExpression(JSON_ID, STRINGIFY_ID),
    args
  );
}
