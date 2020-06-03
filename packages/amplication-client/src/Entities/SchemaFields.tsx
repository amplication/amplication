import React, { useEffect, useRef } from "react";
import { FormikProps } from "formik";
import { SchemaField } from "./SchemaField";
import { Schema } from "../entityFieldProperties/validationSchemaFactory";

type Props = {
  schema: Schema;
  formik: FormikProps<any>;
};

export const SchemaFields = ({ schema, formik }: Props) => {
  // Overcome Formik disability to set initial values dynamically by setting
  // properties initialValues when the schema changes.
  // Since formik instance changes on every render a ref is used to explicity
  // check schema
  const lastSchema = useRef<Schema>();
  useEffect(() => {
    if (schema !== lastSchema.current) {
      const initialValues = getInitialValues(schema);
      formik.setFieldValue("properties", initialValues);
    }
    lastSchema.current = schema;
  }, [schema, formik]);

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

export function getInitialValues(schema: Schema): Object {
  return Object.fromEntries(
    Object.entries(schema.properties)
      .filter(([, property]) => "default" in property)
      .map(([name, property]) => [name, property.default])
  );
}
