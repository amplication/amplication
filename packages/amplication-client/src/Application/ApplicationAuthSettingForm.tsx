import { Snackbar, TextField, ToggleField } from "@amplication/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import * as models from "../models";
import "@rmwc/snackbar/styles";
import { Form, Formik } from "formik";
import React, { useCallback, useContext } from "react";

import { match } from "react-router-dom";

import "./ApplicationAuthSettingForm.scss";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import { useTracking } from "react-tracking";
import { formatError } from "../util/error";

type Props = {
  match: match<{ application: string }>;
};
type TData = {
  updateAppSettings: models.AppSettings;
};

const FORM_SCHEMA = {
  required: ["authProvider", "appUserName", "appPassword"],
  properties: {
    authProvider: {
      type: "string",
      minLength: 2,
    },
    appUserName: {
      type: "string",
      minLength: 2,
    },
    appPassword: {
      type: "string",
      minLength: 5,
    },
  },
};

const CLASS_NAME = "application-auth-settings-form";

function ApplicationAuthSettingForm({ match }: Props) {
  const applicationId = match.params.application;

  const { data, error } = useQuery<{
    appSettings: models.AppSettings;
  }>(GET_APP_SETTINGS, {
    variables: {
      id: applicationId,
    },
  });

  const pendingChangesContext = useContext(PendingChangesContext);

  const { trackEvent } = useTracking();

  const [updateAppSettings, { error: updateError }] = useMutation<TData>(
    UPDATE_APP_SETTINGS,
    {
      onCompleted: (data) => {
        pendingChangesContext.addBlock(data.updateAppSettings.id);
      },
    }
  );

  const handleSubmit = useCallback(
    (data: models.AppSettings) => {
      const { dbHost, dbName, dbPassword, dbPort, dbUser, authProvider } = data;
      trackEvent({
        eventName: "updateAppSettings",
      });
      updateAppSettings({
        variables: {
          data: {
            dbHost,
            dbName,
            dbPassword,
            dbPort,
            dbUser,
            authProvider,
          },
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [updateAppSettings, applicationId, trackEvent]
  );

  const errorMessage = formatError(error || updateError);

  return (
    <div className={CLASS_NAME}>
      {data?.appSettings && (
        <Formik
          initialValues={data.appSettings}
          validate={(values: models.AppSettings) =>
            validate(values, FORM_SCHEMA)
          }
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <FormikAutoSave debounceMS={2000} />
                <h3>Authentication Providers</h3>

                <p>
                  All the below settings will appear in clear text in the
                  generated app. <br />
                  It should only be used for the development environment
                  variables and should not include sensitive data.
                </p>

                <div className={`${CLASS_NAME}__space`}>
                  <ToggleField
                    name="Http"
                    label="Basic HTTP"
                    disabled={!false}
                  />
                </div>
                <div className={`${CLASS_NAME}__space`}>
                  <ToggleField name="Jwt" label="JWT" disabled={!false} />
                </div>

                <hr />

                <h3>Default Credentials</h3>

                <TextField
                  name="appUserName"
                  autoComplete="off"
                  label="App Default User Name"
                />
                <TextField
                  name="appPassword"
                  autoComplete="off"
                  label="App Default Password"
                />
              </Form>
            );
          }}
        </Formik>
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
}

export default ApplicationAuthSettingForm;

const UPDATE_APP_SETTINGS = gql`
  mutation updateAppSettings($data: AppSettingsUpdateInput!, $appId: String!) {
    updateAppSettings(data: $data, where: { id: $appId }) {
      id
      dbHost
      dbName
      dbUser
      dbPassword
      dbPort
      authProvider
      appUserName
      appPassword
    }
  }
`;

const GET_APP_SETTINGS = gql`
  query appSettings($id: String!) {
    appSettings(where: { id: $id }) {
      id
      dbHost
      dbName
      dbUser
      dbPassword
      dbPort
      authProvider
      appUserName
      appPassword
    }
  }
`;
