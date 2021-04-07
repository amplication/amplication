import { validate } from "./formikValidateJsonSchema";
import { EntityInput } from "../Entity/EntityForm";

const EQUAL_TEXT = {
  PLURAL_DISPLAY_NAME_AND_NAME:
    "Name and plural display names cannot be equal. The ‘plural display name’ field must be in a plural form and ‘name’ field must be in a singular form",
};

const FORM_SCHEMA = {
  required: ["name", "displayName", "pluralDisplayName"],
  properties: {
    displayName: {
      type: "string",
      minLength: 2,
    },
    name: {
      type: "string",
      minLength: 2,
    },
    pluralDisplayName: {
      type: "string",
      minLength: 2,
    },
  },
};

export function isEqual(value1: string, value2: string) {
  return (
    value1?.toLocaleLowerCase().trim() === value2?.toLocaleLowerCase().trim()
  );
}

export function validateSchemaAndEqualEntities(values: EntityInput) {
  if (isEqual(values.name, values.pluralDisplayName)) {
    return {
      pluralDisplayName: EQUAL_TEXT.PLURAL_DISPLAY_NAME_AND_NAME,
    };
  }

  return validate(values, FORM_SCHEMA);
}
