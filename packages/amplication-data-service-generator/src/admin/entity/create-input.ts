import { builders, namedTypes } from "ast-types";
import { EntityField } from "../../types";

const DIV_ID = builders.jsxIdentifier("div");
const LABEL_ID = builders.jsxIdentifier("label");
const SINGLE_SPACE_STRING_LITERAL = builders.stringLiteral(" ");
const TEXT_FIELD_ID = builders.jsxIdentifier("TextField");
const NAME_ID = builders.jsxIdentifier("name");

export function createInput(field: EntityField): namedTypes.JSXElement {
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
      builders.jsxElement(
        builders.jsxOpeningElement(
          TEXT_FIELD_ID,
          [builders.jsxAttribute(NAME_ID, builders.stringLiteral(field.name))],
          true
        )
      ),
    ]
  );
}
