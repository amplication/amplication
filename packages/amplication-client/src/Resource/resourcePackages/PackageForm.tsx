import { useMemo } from "react";
import { Formik } from "formik";
import { omit } from "lodash";
import * as models from "../../models";
import { TextField, Form } from "@amplication/ui/design-system";
import { validate } from "../../util/formikValidateJsonSchema";

import FormikAutoSave from "../../util/formikAutoSave";
import { DisplayNameField } from "../../Components/DisplayNameField";

type Props = {
  onSubmit: (values: models.Package) => void;
  defaultValues?: models.Package;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

export const INITIAL_VALUES: Partial<models.Package> = {
  summary: "",
};

const FORM_SCHEMA = {
  required: ["displayName", "summary"],
  properties: {
    displayName: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
  },
};

const PackageForm = ({ onSubmit, defaultValues }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.Package;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.Package) => validate(values, FORM_SCHEMA)}
      enableReinitialize
      onSubmit={onSubmit}
    >
      <Form childrenAsBlocks>
        <FormikAutoSave debounceMS={1000} />
        <DisplayNameField name="displayName" label="Display Name" required />
        <TextField
          name="summary"
          label="Summary"
          textarea
          textareaSize="large"
        />
      </Form>
    </Formik>
  );
};

export default PackageForm;
