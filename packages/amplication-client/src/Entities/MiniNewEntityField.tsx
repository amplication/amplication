import React, { useCallback, useEffect } from "react";
import { useFormik } from "formik";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { INITIAL_VALUES } from "./EntityFieldForm";
import {
  useCreateEntityFieldRouteParams,
  useCreateEntityField,
} from "./NewEntityField";

const MiniNewEntityField = () => {
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
    if (data) {
      formik.resetForm();
    }
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
      />
      <Button disabled={loading} raised>
        Add
      </Button>
    </form>
  );
};

export default MiniNewEntityField;
