import { SelectField, Snackbar } from "@amplication/design-system";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import { match } from "react-router-dom";
import { useTracking } from "react-tracking";
import * as models from "../models";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import "./ApplicationAuthSettingForm.scss";
import { GET_APP_SETTINGS, UPDATE_APP_SETTINGS } from "./appSettings/GenerationSettingsForm";
import useSettingsHook from "./useSettingsHook";

type Props = {
  match: match<{ application: string }>;
};
type TData = {
  updateAppSettings: models.AppSettings;
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
                <FormikAutoSave debounceMS={2000} />
                <div className={`${CLASS_NAME}__header`}>
                  <h3>Authentication Providers</h3>
                </div>
                <p className={`${CLASS_NAME}__description`}>
                  Select the authentication method to be used in the generated
                  app.
                </p>

                <div className={`${CLASS_NAME}__space`}>
                  <SelectField
                    label="Authentication provider"
                    name="authProvider"
                    options={Object.keys(models.EnumAuthProviderType).map(
                      (authProvider) => ({
                        label: authProvider,
                        value: authProvider,
                      })
                    )}
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

export default ApplicationAuthSettingForm;
