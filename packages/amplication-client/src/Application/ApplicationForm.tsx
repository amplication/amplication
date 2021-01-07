import React, { useCallback } from "react";
import { gql, useMutation } from "@apollo/client";
import { Formik, Form } from "formik";
import { validate } from "../util/formikValidateJsonSchema";
import { Icon } from "@rmwc/icon";

import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import * as models from "../models";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import { TextField } from "@amplication/design-system";
import { COLORS } from "./constants";
import { ColorSelectButton } from "../Components/ColorSelectButton";
import { useTracking } from "../util/analytics";

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

function ApplicationForm({ app }: Props) {
  const applicationId = app.id;
  const { trackEvent } = useTracking();

  const [updateApp, { error }] = useMutation<TData>(UPDATE_APP);

  const handleSubmit = useCallback(
    (data) => {
      const { name, description, color } = data;
      trackEvent({
        eventName: "updateAppInfo",
      });
      updateApp({
        variables: {
          data: {
            name,
            description,
            color,
          },
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [updateApp, applicationId, trackEvent]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      trackEvent({
        eventName: "updateAppColor",
      });
      updateApp({
        variables: {
          data: {
            color,
          },
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [updateApp, applicationId, trackEvent]
  );

  const errorMessage = formatError(error);
  return (
    <>
      <Formik
        initialValues={app}
        validate={(values: models.App) => validate(values, FORM_SCHEMA)}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(formik) => {
          return (
            <Form>
              <FormikAutoSave debounceMS={1000} />
              <TextField name="name" label="Application Name" />
              <TextField
                autoComplete="off"
                textarea
                rows={3}
                name="description"
                label="Description"
              />
              <div>
                <hr />
                <h2>
                  <Icon icon="color" />
                  App Color
                </h2>
                {COLORS.map((color) => (
                  <ColorSelectButton
                    color={color}
                    key={color.value}
                    onColorSelected={handleColorChange}
                  />
                ))}
              </div>
            </Form>
          );
        }}
      </Formik>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
}

export default ApplicationForm;

const UPDATE_APP = gql`
  mutation updateApp($data: AppUpdateInput!, $appId: String!) {
    updateApp(data: $data, where: { id: $appId }) {
      id
      createdAt
      updatedAt
      name
      description
      color
    }
  }
`;
