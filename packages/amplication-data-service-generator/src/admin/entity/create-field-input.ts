import { namedTypes } from "ast-types";
import {
  EnumDataType,
  EntityField,
  EntityOptionSetField,
  EntityMultiSelectOptionSetField,
  LookupResolvedProperties,
} from "../../types";
import { jsxElement } from "../util";

/**
 * Creates an input element to be placed inside a Formik form for editing the given entity field
 * @param field the entity field to create input for
 * @returns the input element AST representation
 */
export function createFieldInput(field: EntityField): namedTypes.JSXElement {
  const createDataTypeFieldInput = DATA_TYPE_TO_FIELD_INPUT[field.dataType];

  if (!createDataTypeFieldInput) {
    return jsxElement`<div/>`;
  }

  return jsxElement`${createDataTypeFieldInput(field)}`;
}

const DATA_TYPE_TO_FIELD_INPUT: {
  [key in EnumDataType]: null | ((field: EntityField) => namedTypes.JSXElement);
} = {
  [EnumDataType.SingleLineText]: (field) =>
    jsxElement`<TextInput label="${field.displayName}" source="${field.name}" />`,
  [EnumDataType.MultiLineText]: (field) =>
    jsxElement`<TextInput label="${field.displayName}" multiline source="${field.name}" />`,
  [EnumDataType.Email]: (field) =>
    jsxElement`<TextInput label="${field.displayName}" source="${field.name}" type="email" />`,
  [EnumDataType.WholeNumber]: (field) =>
    jsxElement`<NumberInput step={1} label="${field.displayName}" source="${field.name}" />`,
  [EnumDataType.DateTime]: (field) => {
    const { dateOnly } = field.properties;
    return dateOnly
      ? jsxElement`<DateInput label="${field.displayName}" source="${field.name}" />`
      : jsxElement`<DateTimeInput label="${field.displayName}" source="${field.name}" />`;
  },
  [EnumDataType.DecimalNumber]: (field) =>
    jsxElement`<NumberInput label="${field.displayName}" source="${field.name}" />`,

  [EnumDataType.Lookup]: (field) => {
    const { relatedEntity } = field.properties as LookupResolvedProperties;
    return jsxElement`<ReferenceInput source="${relatedEntity.name.toLowerCase()}.id" reference="${
      relatedEntity.name
    }" label="${field.displayName}">
      <SelectInput optionText={${relatedEntity.name}Title} />
    </ReferenceInput>`;
  },
  [EnumDataType.MultiSelectOptionSet]: (field) => {
    const optionSetField = field as EntityMultiSelectOptionSetField;
    return jsxElement`<SelectArrayInput
      label="${field.displayName}"
      source="${field.name}"
      choices={${JSON.stringify(optionSetField.properties.options)}}
      optionText="label"
      optionValue="value"
    />`;
  },
  [EnumDataType.OptionSet]: (field) => {
    const optionSetField = field as EntityOptionSetField;
    return jsxElement`<SelectInput
      source="${field.name}"
      label="${field.displayName}"
      choices={${JSON.stringify(optionSetField.properties.options)}}
      optionText="label"
      ${!field.required ? "allowEmpty" : ""}
      optionValue="value"/>`;
  },
  [EnumDataType.Boolean]: (field) =>
    jsxElement`<BooleanInput label="${field.displayName}" source="${field.name}" />`,
  /** @todo use geographic location */
  [EnumDataType.GeographicLocation]: (field) =>
    jsxElement`<TextInput label="${field.displayName}" source="${field.name}" />`,
  [EnumDataType.Id]: (field) =>
    jsxElement`<TextInput label="${field.displayName}" source="${field.name}" disabled />`,
  [EnumDataType.CreatedAt]: (field) =>
    jsxElement`<DateTimeInput label="${field.displayName}" source="${field.name}" disabled />`,
  [EnumDataType.UpdatedAt]: (field) =>
    jsxElement`<DateTimeInput label="${field.displayName}" source="${field.name}" disabled />`,
  [EnumDataType.Json]: null,
  [EnumDataType.Roles]: (field) =>
    jsxElement`<SelectArrayInput
      source="${field.name}"
      choices={ROLES_OPTIONS}
      optionText="label"
      optionValue="value"
    />`,
  [EnumDataType.Username]: (field) =>
    jsxElement`<TextInput label="${field.displayName}" source="${field.name}" />`,
  [EnumDataType.Password]: (field) =>
    jsxElement`<PasswordInput label="${field.displayName}" source="${field.name}" disabled />`,
};
