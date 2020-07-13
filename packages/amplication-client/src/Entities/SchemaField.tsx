import React, { useMemo } from "react";
import { capitalCase } from "capital-case";
import { TextField } from "../Components/TextField";
import { ToggleField } from "../Components/ToggleField";
import { SelectField } from "../Components/SelectField";
import { SchemaProperty } from "../entityFieldProperties/validationSchemaFactory";

export const SchemaField = ({
  propertyName,
  propertySchema,
}: {
  propertyName: string;
  propertySchema: SchemaProperty;
}) => {
  const options = useMemo(() => {
    return propertySchema?.items?.enum
      ? propertySchema.items.enum.map((value: string) => ({
          value,
          label: value,
        }))
      : [];
  }, [propertySchema]);

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
        case "string": {
          return (
            <>
              <SelectField
                allowCreate={true}
                label={label}
                name={fieldName}
                options={options}
                isMulti={true}
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
