import { builders, namedTypes } from "ast-types";
import { ExpressionKind } from "ast-types/gen/kinds";
import { EntityField } from "../../types";

const JSON_ID = builders.identifier("JSON");
const STRINGIFY_ID = builders.identifier("stringify");
const DIV_ID = builders.jsxIdentifier("div");
const LABEL_ID = builders.jsxIdentifier("label");
const SINGLE_SPACE_STRING_LITERAL = builders.stringLiteral(" ");

export function createField(
  field: EntityField,
  dataId: namedTypes.Identifier
): namedTypes.JSXElement {
  return builders.jsxElement(
    builders.jsxOpeningElement(DIV_ID),
    builders.jsxClosingElement(DIV_ID),
    [
      builders.jsxElement(
        builders.jsxOpeningElement(LABEL_ID),
        builders.jsxClosingElement(LABEL_ID),
        [builders.jsxText(field.displayName)]
      ),
      builders.jsxExpressionContainer(SINGLE_SPACE_STRING_LITERAL),
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
