import * as models from "../models";
import type { JSONSchema7 as JSONSchema } from "json-schema";

//return a JSON Schema object that can be used to validate the custom properties
const getPropertiesValidationSchemaUtil = (
  customProperties: models.CustomProperty[]
) => {
  const properties: Record<string, JSONSchema> = {};
  const required: string[] = [];
  const errorMessage = {
    properties: {},
  };

  for (const customProperty of customProperties) {
    const key = customProperty.key;
    const schema: JSONSchema & {
      isNotEmpty?: boolean;
    } = {
      title: customProperty.name,
      type: "string",
    };

    if (customProperty.type === models.EnumCustomPropertyType.Select) {
      schema.enum = customProperty.options.map((option) => option.value);
    }

    if (customProperty.type === models.EnumCustomPropertyType.MultiSelect) {
      schema.type = "array";
      schema.items = {
        type: "string",
        enum: customProperty.options.map((option) => option.value),
      };
    }

    if (customProperty.required) {
      required.push(key);
      schema.isNotEmpty = true;
      errorMessage.properties[key] = `${customProperty.name} is required`;

      if (customProperty.type === models.EnumCustomPropertyType.MultiSelect) {
        schema.minItems = 1;
        errorMessage.properties[
          key
        ] = `At least one ${customProperty.name} is required`;
      }
    }

    if (customProperty.validationRule) {
      schema.pattern = customProperty.validationRule;
      errorMessage.properties[key] = customProperty.validationMessage;
    }

    properties[key] = schema;
  }

  return {
    schema: {
      additionalProperties: false, //do not allow additional properties
      type: "object",
      required,
      errorMessage,
      properties,
    },
  };
};

export default getPropertiesValidationSchemaUtil;
