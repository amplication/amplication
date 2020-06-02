import React from "react";
import { Field } from "formik";
import { capitalCase } from "capital-case";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Switch } from "@rmwc/switch";
import "@rmwc/switch/styles";
import { RepeatedTextField } from "./RepeatedTextField";
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
      return <Field name={fieldName} as={TextField} label={label} />;
    }
    case "integer":
    case "number": {
      return (
        <Field type="number" name={fieldName} as={TextField} label={label} />
      );
    }
    case "boolean": {
      return (
        <>
          {label} <Field name={fieldName} as={Switch} />
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
              <Field
                name={fieldName}
                as={RepeatedTextField}
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
