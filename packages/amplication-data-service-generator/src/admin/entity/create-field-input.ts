import { namedTypes } from "ast-types";
import {
  EnumDataType,
  EntityField,
  EntityOptionSetField,
  EntityMultiSelectOptionSetField,
  LookupResolvedProperties,
} from "../../types";
import { EntityComponent } from "../types";
import { jsxElement } from "../util";

/**
 * Creates an input element to be placed inside a Formik form for editing the given entity field
 * @param field the entity field to create input for
 * @returns the input element AST representation
 */
export function createFieldInput(
  field: EntityField,
  entityToSelectComponent: Record<string, EntityComponent>
): namedTypes.JSXElement {
  const createDataTypeFieldInput = DATA_TYPE_TO_FIELD_INPUT[field.dataType];

  if (!createDataTypeFieldInput) {
    return jsxElement`<div/>`;
  }

  return jsxElement`<div>${createDataTypeFieldInput(
    field,
    entityToSelectComponent
  )}</div>`;
}

const DATA_TYPE_TO_FIELD_INPUT: {
  [key in EnumDataType]:
    | null
    | ((
        field: EntityField,
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
  [EnumDataType.Lookup]: (field, entityToSelectComponent) => {
    const { relatedEntity } = field.properties as LookupResolvedProperties;
    const relatedEntitySelectComponent =
      entityToSelectComponent[relatedEntity.name];
    return jsxElement`<${relatedEntitySelectComponent.name} label="${field.displayName}" name="${field.name}.id" />`;
  },
  [EnumDataType.MultiSelectOptionSet]: (field) => {
    const optionSetField = field as EntityMultiSelectOptionSetField;
    return jsxElement`<SelectField
      label="${field.displayName}"
      name="${field.name}"
      options={${JSON.stringify(optionSetField.properties.options)}}
      isMulti
    />`;
  },
  [EnumDataType.OptionSet]: (field) => {
    const optionSetField = field as EntityOptionSetField;
    return jsxElement`<SelectField
              label="${field.displayName}"
              name="${field.name}"
               options={${JSON.stringify(optionSetField.properties.options)}}
            />`;
  },
  [EnumDataType.Boolean]: (field) =>
    jsxElement`<ToggleField label="${field.displayName}" name="${field.name}" />`,
  /** @todo use geographic location */
  [EnumDataType.GeographicLocation]: (field) =>
    jsxElement`<TextField label="${field.displayName}" name="${field.name}" />`,
  [EnumDataType.Id]: null,
  [EnumDataType.CreatedAt]: null,
  [EnumDataType.UpdatedAt]: null,
  [EnumDataType.Json]: null,
  [EnumDataType.Roles]: (field) =>
    jsxElement`<RoleSelect label="${field.displayName}" name="${field.name}" />`,
  [EnumDataType.Username]: (field) =>
    jsxElement`<TextField label="${field.displayName}" name="${field.name}"  />`,
  [EnumDataType.Password]: (field) =>
    jsxElement`<TextField type="password" label="${field.displayName}" name="${field.name}"  />`,
};
