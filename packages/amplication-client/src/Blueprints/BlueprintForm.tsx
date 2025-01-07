import {
  ColorPickerField,
  Form,
  TextField,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import { DisplayNameField } from "../Components/DisplayNameField";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";

import OptionalDescriptionField from "../Components/OptionalDescriptionField";
import FormikAutoSave from "../util/formikAutoSave";

type Props = {
  onSubmit: (values: models.Blueprint) => void;
  defaultValues?: models.Blueprint;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "relations",
  "properties",
  "__typename",
];

export const INITIAL_VALUES: Partial<models.Blueprint> = {
  name: "",
  description: "",
};

const FORM_SCHEMA = {
  required: ["name", "key"],

  errorMessage: {},
};

const BlueprintForm = ({ onSubmit, defaultValues }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.Blueprint;
  }, [defaultValues]);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validate={(values: models.Blueprint) => validate(values, FORM_SCHEMA)}
        enableReinitialize
        onSubmit={onSubmit}
      >
        <Form childrenAsBlocks>
          <FormikAutoSave debounceMS={1000} />

          <DisplayNameField name="name" label="Name" minLength={1} />
          <TextField name="key" label="Key" />

          <OptionalDescriptionField name="description" label="Description" />
          <ColorPickerField name="color" label="Color" />
        </Form>
      </Formik>
    </>
  );
};

export default BlueprintForm;
