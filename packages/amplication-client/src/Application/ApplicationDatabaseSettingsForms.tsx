import { TextField } from "@amplication/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { Form, Formik } from "formik";
import React, { useCallback, useContext } from "react";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import { match } from "react-router-dom";
type Props = {
  match: match<{ application: string }>;
};

type TData = {
  updateAppSettings: models.AppSettings;
};

const FORM_SCHEMA = {
  required: ["dbHost", "dbUser", "dbPassword", "dbPort"],
  properties: {
    dbHost: {
      type: "string",
      minLength: 2,
    },
    dbUser: {
      type: "string",
      minLength: 2,
    },
    dbPassword: {
      type: "string",
      minLength: 2,
    },
    dbPort: {
      type: "integer",
      minLength: 4,
      maxLength: 5,
    },
    dbName: {
      type: "string",
    },
  },
};

const CLASS_NAME = "ApplicationDatabaseSettingsForm.scss";

function ApplicationDatabaseSettingsForms({ match }: Props) {
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
      const { dbHost, dbName, dbPassword, dbPort, dbUser } = data;
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
                <h3>DB Settings</h3>
                <p>
                  All the below settings will appear in clear text in the
                  generated app. <br />
                  It should only be used for the development environment
                  variables and should not include sensitive data.
                </p>
                <FormikAutoSave debounceMS={2000} />
                <TextField name="dbHost" autoComplete="off" label="Host" />
                <TextField
                  name="dbName"
                  autoComplete="off"
                  label="Database Name"
                />
                <TextField
                  name="dbPort"
                  type="number"
                  autoComplete="off"
                  label="Port"
                />
                <TextField name="dbUser" autoComplete="off" label="User" />
                <TextField
                  name="dbPassword"
                  autoComplete="off"
                  label="Password"
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

export default ApplicationDatabaseSettingsForms;

const UPDATE_APP_SETTINGS = gql`
  mutation updateAppSettings($data: AppSettingsUpdateInput!, $appId: String!) {
    updateAppSettings(data: $data, where: { id: $appId }) {
      id
      dbHost
      dbName
      dbUser
      dbPassword
      dbPort
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
    }
  }
`;
