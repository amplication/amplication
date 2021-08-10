import React, { useCallback } from "react";
import { match } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
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
import { GET_APPLICATION } from "./ApplicationHome";
import "./ApplicationForm.scss";

type Props = {
  match: match<{ application: string }>;
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

const CLASS_NAME = "application-form";

function ApplicationForm({ match }: Props) {
  const applicationId = match.params.application;

  const { data, error } = useQuery<{
    app: models.App;
  }>(GET_APPLICATION, {
    variables: {
      id: applicationId,
    },
  });

  const { trackEvent } = useTracking();

  const [updateApp, { error: updateError }] = useMutation<TData>(UPDATE_APP);

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

  const errorMessage = formatError(error || updateError);
  return (
    <div className={CLASS_NAME}>
      {data?.app && (
        <>
          <Formik
            initialValues={data.app}
            validate={(values: models.App) => validate(values, FORM_SCHEMA)}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <h3>App Settings</h3>
                  <FormikAutoSave debounceMS={1000} />
                  <TextField name="name" label="Name" />
                  <TextField
                    autoComplete="off"
                    textarea
                    rows={3}
                    name="description"
                    label="Description"
                  />
                </Form>
              );
            }}
          </Formik>
         
          
          <div>
            <hr />
            <h3>
              <Icon icon="color" />
              App Color
            </h3>
            {COLORS.map((color) => (
              <ColorSelectButton
                color={color}
                key={color.value}
                onColorSelected={handleColorChange}
              />
            ))}
          </div>
        </>
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
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
