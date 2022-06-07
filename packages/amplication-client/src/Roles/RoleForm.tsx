import React, { useMemo } from "react";
import { Formik } from "formik";
import { Form } from "../Components/Form";
import { omit } from "lodash";
import * as models from "../models";
import { DisplayNameField } from "../Components/DisplayNameField";
import NameField from "../Components/NameField";
import { TextField } from "@amplication/design-system";
import { validate } from "../util/formikValidateJsonSchema";

import FormikAutoSave from "../util/formikAutoSave";

type Props = {
  onSubmit: (values: models.AppRole) => void;
  defaultValues?: models.AppRole;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

export const INITIAL_VALUES: Partial<models.AppRole> = {
  name: "",
  displayName: "",
  description: "",
};

const FORM_SCHEMA = {
  required: ["displayName", "name"],
  properties: {
    displayName: {
      type: "string",
      minLength: 2,
    },
    name: {
      type: "string",
      minLength: 2,
    },
  },
};

const RoleForm = ({ onSubmit, defaultValues }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.AppRole;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.AppRole) => validate(values, FORM_SCHEMA)}
      enableReinitialize
      onSubmit={onSubmit}
    >
      <Form childrenAsBlocks>
        <FormikAutoSave debounceMS={1000} />

        <NameField name="name" />

        <DisplayNameField
          name="displayName"
          label="Display Name"
          minLength={1}
        />

        <TextField name="description" label="Description" textarea rows={3} />
      </Form>
    </Formik>
  );
};

export default RoleForm;
