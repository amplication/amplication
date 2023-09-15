import React, { useMemo } from "react";
import { Formik } from "formik";
import { Form } from "../Components/Form";
import { omit } from "lodash";
import * as models from "../models";
import { TextField } from "@amplication/ui/design-system";
import { validate } from "../util/formikValidateJsonSchema";

import FormikAutoSave from "../util/formikAutoSave";
import NameField from "../Components/NameField";

type Props = {
  onSubmit: (values: models.Module) => void;
  defaultValues?: models.Module;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

export const INITIAL_VALUES: Partial<models.Module> = {
  name: "",
  displayName: "",
  description: "",
};

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
  },
};

const ModuleForm = ({ onSubmit, defaultValues }: Props) => {
  const initialValues = useMemo(() => {
    console.log("defaultValues", defaultValues);
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.Module;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.Module) => validate(values, FORM_SCHEMA)}
      enableReinitialize
      onSubmit={onSubmit}
    >
      <Form childrenAsBlocks>
        <FormikAutoSave debounceMS={1000} />
        <NameField label="Name" name="name" />
        <TextField name="description" label="Description" textarea rows={3} />
      </Form>
    </Formik>
  );
};

export default ModuleForm;
