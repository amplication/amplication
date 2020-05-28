import React from "react";
import { SchemaField } from "./SchemaField";
import * as entityFieldPropertiesValidationSchemaFactory from "../entityFieldProperties/validationSchemaFactory";

export const SchemaFields = ({
  schema,
}: {
  schema: ReturnType<
    typeof entityFieldPropertiesValidationSchemaFactory.getSchema
  >;
}) => {
  if (schema === null) {
    return null;
  }
  if (schema.type !== "object") {
    throw new Error(`Unexpected type ${schema.type}`);
  }
  return (
    <>
      {Object.entries(schema.properties).map(([name, property]) => {
        if (!property) {
          throw new Error(`Missing property: ${name}`);
        }
        return (
          <div key={name}>
            <p>
              <SchemaField propertyName={name} propertySchema={property} />
            </p>
          </div>
        );
      })}
    </>
  );
};
