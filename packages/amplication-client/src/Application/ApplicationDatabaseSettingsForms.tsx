import { TextField, Snackbar } from "@amplication/design-system";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import { match } from "react-router-dom";
import "./ApplicationDatabaseSettingsForms.scss";
import { GET_APP_SETTINGS, UPDATE_APP_SETTINGS } from "./appSettings/GenerationSettingsForm";
import useSettingsHook from "./useSettingsHook";

type Props = {
  match: match<{ application: string }>;
};

type TData = {
  updateAppSettings: models.AppSettings;
};

const CLASS_NAME = "application-database-settings-form";

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

  const {handleSubmit, FORM_SCHEMA} = useSettingsHook({
    trackEvent,
    updateAppSettings,
    applicationId
  });

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
                <div className={`${CLASS_NAME}__header`}>
                  <h3>Database Settings</h3>
                </div>
                <p className={`${CLASS_NAME}__description`}>
                  All the below settings will appear in clear text in the
                  generated app. <br />
                  It should only be used for the development environment
                  variables and should not include sensitive data.
                </p>
                <FormikAutoSave debounceMS={2000} />
                <div className={`${CLASS_NAME}__formWrapper`}>
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="dbHost"
                    autoComplete="off"
                    label="Host"
                  />
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="dbName"
                    autoComplete="off"
                    label="Database Name"
                  />
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="dbPort"
                    type="number"
                    autoComplete="off"
                    label="Port"
                  />
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="dbUser"
                    autoComplete="off"
                    label="User"
                  />
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="dbPassword"
                    autoComplete="off"
                    label="Password"
                  />
                </div>
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
