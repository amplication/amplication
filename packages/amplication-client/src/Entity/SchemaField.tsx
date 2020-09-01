import React, { useMemo } from "react";
import { capitalCase } from "capital-case";
import { TextField } from "../Components/TextField";
import { ToggleField } from "../Components/ToggleField";
import { SchemaProperty } from "../entityFieldProperties/validationSchemaFactory";
import OptionSet from "../Entity/OptionSet";

export const SchemaField = ({
  propertyName,
  propertySchema,
}: {
  propertyName: string;
  propertySchema: SchemaProperty;
}) => {
  const fieldName = `properties.${propertyName}`;
  const label = capitalCase(propertyName);
  switch (propertySchema.type) {
    case "string": {
      return <TextField name={fieldName} label={label} />;
    }
    case "integer":
    case "number": {
      return <TextField type="number" name={fieldName} label={label} />;
    }
    case "boolean": {
      return <ToggleField name={fieldName} label={label} />;
    }
    case "array": {
      if (!propertySchema.items) {
        throw new Error("Array schema must define items");
      }

      switch (propertySchema.items.type) {
        case "object": {
          return (
            <>
              <OptionSet label={label} name={fieldName} />
            </>
          );
        }
        default: {
          throw new Error(
            `Unexpected propertySchema.items.type: ${propertySchema.type}`
          );
        }
      }
    }
    default: {
      throw new Error(`Unexpected propertySchema.type: ${propertySchema.type}`);
    }
  }
};
