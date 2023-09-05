import React, { useMemo } from "react";
import { Formik } from "formik";
import { Form } from "../Components/Form";
import { omit } from "lodash";
import * as models from "../models";
import { DisplayNameField } from "../Components/DisplayNameField";
import NameField from "../Components/NameField";
import { TextField } from "@amplication/ui/design-system";
import {
  validate,
  validationErrorMessages,
} from "../util/formikValidateJsonSchema";

import FormikAutoSave from "../util/formikAutoSave";

type Props = {
  onSubmit: (values: models.ResourceRole) => void;
  defaultValues?: models.ResourceRole;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

export const INITIAL_VALUES: Partial<models.ResourceRole> = {
  name: "",
  displayName: "",
  description: "",
};

const { AT_LEAST_TWO_CHARARCTERS } = validationErrorMessages;

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
  errorMessage: {
    properties: {
      displayName: AT_LEAST_TWO_CHARARCTERS,
      name: AT_LEAST_TWO_CHARARCTERS,
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
    } as models.ResourceRole;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.ResourceRole) => validate(values, FORM_SCHEMA)}
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
