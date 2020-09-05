import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import omit from "lodash.omit";
import * as models from "../models";
import { DisplayNameField } from "../Components/DisplayNameField";
import NameField from "../Components/NameField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";

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
      enableReinitialize
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Form>
            <FormikAutoSave debounceMS={1000} />
            <p>
              <NameField name="name" />
            </p>
            <p>
              <DisplayNameField
                name="displayName"
                label="Display Name"
                minLength={1}
              />
            </p>
            <p>
              <OptionalDescriptionField
                name="description"
                label="Description"
              />
            </p>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RoleForm;
