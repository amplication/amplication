import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import NameField from "./fields/NameField";
import { DisplayNameField } from "./fields/DisplayNameField";
import { PluralDisplayNameField } from "./fields/PluralDisplayNameField";
import { BooleanField } from "./fields/BooleanField";
import omit from "lodash.omit";

type Values = {
  name: string;
  displayName: string;
  pluralDisplayName: string;
  allowFeedback: boolean;
};

type Props = {
  onSubmit: (values: Values) => void;
  submitButtonTitle: string;
  defaultValues?: Partial<Values>;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

const INITIAL_VALUES: Values = {
  name: "",
  displayName: "",
  pluralDisplayName: "",
  allowFeedback: false,
};

const EntityForm = ({
  onSubmit,
  submitButtonTitle,
  defaultValues = {},
}: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    };
  }, [defaultValues]);
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      <Form>
        <p>
          <NameField label="Name" name="name" />
        </p>
        <p>
          <DisplayNameField label="Display Name" name="displayName" />
        </p>
        <p>
          <PluralDisplayNameField
            label="Plural Display Name"
            name="pluralDisplayName"
          />
        </p>
        <p>
          <BooleanField name="allowFeedback" label="Allow Feedback" />
        </p>
        <Button raised type="submit">
          {submitButtonTitle}
        </Button>
      </Form>
    </Formik>
  );
};

export default EntityForm;
