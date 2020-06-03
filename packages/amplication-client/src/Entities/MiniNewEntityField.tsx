import React, { useCallback, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { INITIAL_VALUES as ENTITY_FIELD_FORM_INITIAL_VALUES } from "./EntityFieldForm";
import * as entityFieldPropertiesValidationSchemaFactory from "../entityFieldProperties/validationSchemaFactory";
import {
  useCreateEntityFieldRouteParams,
  useCreateEntityField,
} from "./NewEntityField";
import { getInitialValues } from "./SchemaFields";

const DEFAULT_SCHEMA = entityFieldPropertiesValidationSchemaFactory.getSchema(
  ENTITY_FIELD_FORM_INITIAL_VALUES.dataType
);
const SCHEMA_INITIAL_VALUES = getInitialValues(DEFAULT_SCHEMA);
const INITIAL_VALUES = {
  ...ENTITY_FIELD_FORM_INITIAL_VALUES,
  properties: SCHEMA_INITIAL_VALUES,
};

const MiniNewEntityField = () => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const lastData = useRef<any>();
  const { application, entity } = useCreateEntityFieldRouteParams();
  const [createEntityField, { data, error, loading }] = useCreateEntityField(
    application,
    entity
  );

  const handleSubmit = useCallback(
    (data) => {
      createEntityField({
        variables: {
          data: {
            ...data,
            displayName: data.name,
            properties: JSON.stringify(data.properties || {}),
            entity: { connect: { id: entity } },
          },
        },
      });
    },
    [createEntityField, entity]
  );

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    // When field is created reset the form
    if (data !== lastData.current) {
      formik.resetForm();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    lastData.current = data;
  }, [formik, data]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        label="New Field Name"
        name="name"
        onChange={formik.handleChange}
        value={formik.values.name}
        disabled={loading}
        helpText={error}
        inputRef={inputRef}
        autoFocus
      />
      <Button disabled={loading} raised>
        Add
      </Button>
    </form>
  );
};

export default MiniNewEntityField;
