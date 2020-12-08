import { namedTypes } from "ast-types";
import { EntityComponent } from "../types";
import { EnumDataType, EntityField } from "../../types";
import { jsxElement } from "../util";

/**
 * Creates an input element to be placed inside a Formik form for editing the given entity field
 * @param field the entity field to create input for
 * @returns the input element AST representation
 */
export function createFieldInput(
  field: EntityField,
  entityIdToName: Record<string, string>,
  entityToSelectComponent: Record<string, EntityComponent>
): namedTypes.JSXElement {
  const createDataTypeFieldInput = DATA_TYPE_TO_FIELD_INPUT[field.dataType];

  if (!createDataTypeFieldInput) {
    throw new Error(
      `Can not display field ${field.name} with data type ${field.dataType}`
    );
  }
  return jsxElement`<div>${createDataTypeFieldInput(
    field,
    entityIdToName,
    entityToSelectComponent
  )}</div>`;
}

const DATA_TYPE_TO_FIELD_INPUT: {
  [key in EnumDataType]:
    | null
    | ((
        field: EntityField,
        entityIdToName: Record<string, string>,
        entityToSelectComponent: Record<string, EntityComponent>
      ) => namedTypes.JSXElement);
} = {
  [EnumDataType.SingleLineText]: (field) =>
    jsxElement`<TextField label="${field.displayName}" name="${field.name}" />`,
  [EnumDataType.MultiLineText]: (field) =>
    jsxElement`<TextField label="${field.displayName}" name="${field.name}" textarea />`,
  [EnumDataType.Email]: (field) =>
    jsxElement`<TextField type="email" label="${field.displayName}" name="${field.name}" />`,
  [EnumDataType.WholeNumber]: (field) =>
    jsxElement`<TextField type="number" step={1} label="${field.displayName}" name="${field.name}" />`,
  [EnumDataType.DateTime]: (field) => {
    const { dateOnly } = field.properties;
    return dateOnly
      ? jsxElement`<TextField type="date" label="${field.displayName}" name="${field.name}" />`
      : jsxElement`<TextField type="datetime-local" label="${field.displayName}" name="${field.name}" />`;
  },
  [EnumDataType.DecimalNumber]: (field) =>
    jsxElement`<TextField type="number" label="${field.displayName}" name="${field.name}" />`,
  /** @todo use search */
  [EnumDataType.Lookup]: (field, entityIdToName, entityToSelectComponent) => {
    const relatedEntityName = entityIdToName[field.properties.relatedEntityId];
    const relatedEntitySelectComponent =
      entityToSelectComponent[relatedEntityName];
    return jsxElement`<${relatedEntitySelectComponent.name} label="${field.displayName}" name="${field.name}.id" />`;
  },
  /** @todo use select */
  [EnumDataType.MultiSelectOptionSet]: (field) =>
    jsxElement`<TextField label="${field.displayName}" name="${field.name}" />`,
  /** @todo use select */
  [EnumDataType.OptionSet]: (field) =>
    jsxElement`<TextField label="${field.displayName}" name="${field.name}" />`,
  [EnumDataType.Boolean]: (field) =>
    jsxElement`<TextField type="checkbox" label="${field.displayName}" name="${field.name}" />`,
  /** @todo use geographic location */
  [EnumDataType.GeographicLocation]: (field) =>
    jsxElement`<TextField label="${field.displayName}" name="${field.name}" />`,
  [EnumDataType.Id]: null,
  [EnumDataType.CreatedAt]: null,
  [EnumDataType.UpdatedAt]: null,
  /** @todo use select */
  [EnumDataType.Roles]: (field) =>
    jsxElement`<TextField label="${field.displayName}" name="${field.name}" />`,
  [EnumDataType.Username]: (field) =>
    jsxElement`<TextField label="${field.displayName}" name="${field.name}"  />`,
  [EnumDataType.Password]: (field) =>
    jsxElement`<TextField type="password" label="${field.displayName}" name="${field.name}"  />`,
};
