import { isEmpty } from "lodash";
import * as models from "../models";

//return a JSON Schema object that can be used to validate the custom properties
const getPropertiesValidationSchemaUtil = (
  customProperties: models.CustomProperty[]
) => {
  const schema = customProperties.reduce(
    (acc, property) => {
      acc.properties[property.key] = {
        type: "string",
      };

      if (property.required) {
        acc.required.push(property.key);
        acc.properties[property.key].isNotEmpty = true;
        acc.errorMessage.properties[property.key] = "Field cannot be empty";
      }

      if (!isEmpty(property.validationRule)) {
        acc.properties[property.key].pattern = property.validationRule;
      }
      if (!isEmpty(property.validationMessage)) {
        acc.errorMessage.properties[property.key] = property.validationMessage;
      }
      return acc;
    },
    {
      required: [],
      properties: {},
      errorMessage: {
        properties: {},
      },
    }
  );

  return {
    schema,
  };
};

export default getPropertiesValidationSchemaUtil;
