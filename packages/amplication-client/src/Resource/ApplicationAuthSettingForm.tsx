import { SelectField, Snackbar } from "@amplication/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useCallback, useContext } from "react";
import { match } from "react-router-dom";
import { useTracking } from "react-tracking";
import * as models from "../models";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import "./ApplicationAuthSettingForm.scss";
import { GET_RESOURCE_SETTINGS } from "./appSettings/GenerationSettingsForm";

type Props = {
  match: match<{ resource: string }>;
};
type TData = {
  updateAppSettings: models.AppSettings;
};

const FORM_SCHEMA = {
  required: ["authProvider"],
  properties: {
    authProvider: {
      type: "string",
      minLength: 2,
    },
  },
};

const CLASS_NAME = "application-auth-settings-form";

function ApplicationAuthSettingForm({ match }: Props) {
  const resourceId = match.params.resource;

  const { data, error } = useQuery<{
    appSettings: models.AppSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: resourceId,
    },
  });

  const pendingChangesContext = useContext(PendingChangesContext);

  const { trackEvent } = useTracking();

  const [updateAppSettings, { error: updateError }] = useMutation<TData>(
    UPDATE_RESOURCE_SETTINGS,
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
          resourceId: resourceId,
        },
      }).catch(console.error);
    },
    [updateAppSettings, resourceId, trackEvent]
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
                <div className={`${CLASS_NAME}__header`}>
                  <h3>Authentication Providers</h3>
                </div>
                <p className={`${CLASS_NAME}__description`}>
                  Select the authentication method to be used in the generated
                  resource.
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

const UPDATE_RESOURCE_SETTINGS = gql`
  mutation updateResourceSettings(
    $data: ResourceSettingsUpdateInput!
    $resourceId: String!
  ) {
    updateResourceSettings(data: $data, where: { id: $resourceId }) {
      id
      dbHost
      dbName
      dbUser
      dbPassword
      dbPort
      authProvider
    }
  }
`;
