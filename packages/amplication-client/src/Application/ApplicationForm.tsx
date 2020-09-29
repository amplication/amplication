import React, { useCallback } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Formik, Form } from "formik";
import { validate } from "../util/formikValidateJsonSchema";

import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import * as models from "../models";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import EditableTitleField from "../Components/EditableTitleField";

type Props = {
  app: models.App;
};

type TData = {
  updateApp: models.App;
};

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
    description: {
      type: "string",
    },
  },
};

function ApplicationHome({ app }: Props) {
  const applicationId = app.id;

  const [updateApp, { error }] = useMutation<TData>(UPDATE_APP);

  const handleSubmit = useCallback(
    (data) => {
      const { name, description } = data;
      updateApp({
        variables: {
          data: {
            name,
            description,
          },
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [updateApp, applicationId]
  );

  const errorMessage = formatError(error);
  return (
    <>
      <Formik
        initialValues={app}
        validate={(values: models.App) => {
          return validate<models.App>(values, FORM_SCHEMA);
        }}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(formik) => {
          return (
            <Form>
              <FormikAutoSave debounceMS={1000} />
              <EditableTitleField name="name" label="Application Name" />
              <EditableTitleField
                secondary
                name="description"
                label="Description"
              />
            </Form>
          );
        }}
      </Formik>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
}

export default ApplicationHome;

const UPDATE_APP = gql`
  mutation updateApp($data: AppUpdateInput!, $appId: String!) {
    updateApp(data: $data, where: { id: $appId }) {
      id
      createdAt
      updatedAt
      name
      description
    }
  }
`;
