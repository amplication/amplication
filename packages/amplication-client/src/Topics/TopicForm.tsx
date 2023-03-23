import React, { useMemo } from "react";
import { Formik } from "formik";
import { Form } from "../Components/Form";
import { omit } from "lodash";
import * as models from "../models";
import { TextField } from "@amplication/ui/design-system";
import { validate } from "../util/formikValidateJsonSchema";

import FormikAutoSave from "../util/formikAutoSave";
import TopicNameField from "../Components/TopicNameField";
import { DisplayNameField } from "../Components/DisplayNameField";

type Props = {
  onSubmit: (values: models.Topic) => void;
  defaultValues?: models.Topic;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

export const INITIAL_VALUES: Partial<models.Topic> = {
  name: "",
  displayName: "",
  description: "",
};

const FORM_SCHEMA = {
  required: ["displayName", "name"],
  properties: {
    displayName: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
  },
};

const TopicForm = ({ onSubmit, defaultValues }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.Topic;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.Topic) => validate(values, FORM_SCHEMA)}
      enableReinitialize
      onSubmit={onSubmit}
    >
      <Form childrenAsBlocks>
        <FormikAutoSave debounceMS={1000} />
        <DisplayNameField name="displayName" label="Display Name" required />
        <TopicNameField label="Name" name="name" />
        <TextField name="description" label="Description" textarea rows={3} />
      </Form>
    </Formik>
  );
};

export default TopicForm;
