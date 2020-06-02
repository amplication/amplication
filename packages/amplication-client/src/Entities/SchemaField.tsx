import React from "react";
import { capitalCase } from "capital-case";
import { TextField } from "./fields/TextField";
import { BooleanField } from "./fields/BooleanField";
import { RepeatedTextField } from "./fields/RepeatedTextField";
import { SchemaProperty } from "../entityFieldProperties/validationSchemaFactory";

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
      return (
        <>
          {label} <BooleanField name={fieldName} />
        </>
      );
    }
    case "array": {
      if (!propertySchema.items) {
        throw new Error("Array schema must define items");
      }
      switch (propertySchema.items.type) {
        case "string": {
          return (
            <>
              {label}{" "}
              <RepeatedTextField
                name={fieldName}
                enum={propertySchema.items.enum}
              />
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
