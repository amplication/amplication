import { builders, namedTypes } from "ast-types";
import { typedExpression } from "../../util/ast";
import { EnumDataType, EntityField } from "../../types";

const DIV_ID = builders.jsxIdentifier("div");
const LABEL_ID = builders.jsxIdentifier("label");
const SINGLE_SPACE_STRING_LITERAL = builders.stringLiteral(" ");

const jsxElement = typedExpression(namedTypes.JSXElement);

const DATA_TYPE_TO_FIELD_INPUT: {
  [key in EnumDataType]: null | ((field: EntityField) => namedTypes.JSXElement);
} = {
  [EnumDataType.SingleLineText]: (field) =>
    jsxElement`<TextField name=${builders.stringLiteral(field.name)} />`,
  [EnumDataType.MultiLineText]: (field) =>
    jsxElement`<TextField name=${builders.stringLiteral(
      field.name
    )} textarea />`,
  [EnumDataType.Email]: (field) =>
    jsxElement`<TextField type="email" name=${builders.stringLiteral(
      field.name
    )} />`,
  [EnumDataType.WholeNumber]: (field) =>
    jsxElement`<TextField type="number" step={1} name=${builders.stringLiteral(
      field.name
    )} />`,
  [EnumDataType.DateTime]: (field) => {
    const { dateOnly } = field.properties;
    return dateOnly
      ? jsxElement`<TextField type="date" name=${builders.stringLiteral(
          field.name
        )} />`
      : jsxElement`<TextField type="datetime-local" name=${builders.stringLiteral(
          field.name
        )} />`;
  },
  [EnumDataType.DecimalNumber]: (field) =>
    jsxElement`<TextField type="number" name=${builders.stringLiteral(
      field.name
    )} />`,
  /** @todo use search */
  [EnumDataType.Lookup]: (field) =>
    jsxElement`<TextField name=${builders.stringLiteral(field.name)} />`,
  /** @todo use select */
  [EnumDataType.MultiSelectOptionSet]: (field) =>
    jsxElement`<TextField name=${builders.stringLiteral(field.name)} />`,
  /** @todo use select */
  [EnumDataType.OptionSet]: (field) =>
    jsxElement`<TextField name=${builders.stringLiteral(field.name)} />`,
  [EnumDataType.Boolean]: (field) =>
    jsxElement`<TextField type="checkbox" name=${builders.stringLiteral(
      field.name
    )} />`,
  /** @todo use geographic location */
  [EnumDataType.GeographicLocation]: (field) =>
    jsxElement`<TextField name=${builders.stringLiteral(field.name)} />`,
  [EnumDataType.Id]: null,
  [EnumDataType.CreatedAt]: null,
  [EnumDataType.UpdatedAt]: null,
  /** @todo use select */
  [EnumDataType.Roles]: (field) =>
    jsxElement`<TextField name=${builders.stringLiteral(field.name)} />`,
  [EnumDataType.Username]: (field) =>
    jsxElement`<TextField name=${builders.stringLiteral(
      field.name
    )} textarea />`,
  [EnumDataType.Password]: (field) =>
    jsxElement`<TextField type="password" name=${builders.stringLiteral(
      field.name
    )} textarea />`,
};

/**
 * Creates an input element to be placed inside a Formik form for editing the given entity field
 * @param field the entity field to create input for
 * @returns the input element AST representation
 */
export function createFieldInput(field: EntityField): namedTypes.JSXElement {
  const createDataTypeFieldInput = DATA_TYPE_TO_FIELD_INPUT[field.dataType];
  if (!createDataTypeFieldInput) {
    throw new Error(
      `Can not display field ${field.name} with data type ${field.dataType}`
    );
  }
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
      createDataTypeFieldInput(field),
    ]
  );
}
