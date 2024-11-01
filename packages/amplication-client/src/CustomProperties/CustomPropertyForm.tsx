import { Form, TextField, SelectField } from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import { DisplayNameField } from "../Components/DisplayNameField";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";

import FormikAutoSave from "../util/formikAutoSave";
import CustomPropertyTypeSelectField from "./CustomPropertyTypeSelectField";

type Props = {
  onSubmit: (values: models.CustomProperty) => void;
  defaultValues?: models.CustomProperty;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
  "options",
];

export const INITIAL_VALUES: Partial<models.CustomProperty> = {
  name: "",
  description: "",
};

const FORM_SCHEMA = {
  required: ["name", "key"],

  errorMessage: {},
};

const CustomPropertyForm = ({ onSubmit, defaultValues }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.CustomProperty;
  }, [defaultValues]);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validate={(values: models.CustomProperty) =>
          validate(values, FORM_SCHEMA)
        }
        enableReinitialize
        onSubmit={onSubmit}
      >
        <Form childrenAsBlocks>
          <FormikAutoSave debounceMS={1000} />

          <DisplayNameField name="name" label="Name" minLength={1} />

          <TextField name="description" label="Description" textarea rows={3} />

          <TextField name="key" label="Key" />

          <CustomPropertyTypeSelectField name="type" label="Type" />
        </Form>
      </Formik>
    </>
  );
};

export default CustomPropertyForm;
