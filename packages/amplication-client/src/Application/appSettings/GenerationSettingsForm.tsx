import {
  Snackbar,
  ToggleField,
} from "@amplication/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import { match } from "react-router-dom";
import PendingChangesContext from "../../VersionControl/PendingChangesContext";
import "./GenerationSettingsForm.scss";
import useSettingsHook from "../useSettingsHook";

type Props = {
  match: match<{ application: string }>;
};

type TData = {
  updateAppSettings: models.AppSettings;
};



const CLASS_NAME = "generation-settings-form";

function GenerationSettingsForm({ match }: Props) {
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
                  <h3>APIs Admin UI Settings</h3>
                </div>
                <p className={`${CLASS_NAME}__description`}>
                  Amplication gives you the choice of which components to
                  generate. Use the settings to include or exclude GraphQL API,
                  REST API, and Admin UI.
                </p>
                <hr />
                <FormikAutoSave debounceMS={200} />
                <div className={`${CLASS_NAME}__toggle_wrapper`}>
                  <ToggleField
                    name="serverSettings[generateGraphQL]"
                    label="GraphQL API"
                  />
                  <ToggleField
                    name="serverSettings[generateRestApi]"
                    label="REST API & Swagger UI"
                  />
                  <ToggleField
                    disabled={!data?.appSettings.serverSettings.generateGraphQL}
                    name="adminUISettings[generateAdminUI]"
                    label="Admin UI"
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
      <Snackbar
        open={Boolean(error)}
        message={formatError(error || updateError)}
      />
    </div>
  );
}

export default GenerationSettingsForm;

export const UPDATE_APP_SETTINGS = gql`
  mutation updateAppSettings($data: AppSettingsUpdateInput!, $appId: String!) {
    updateAppSettings(data: $data, where: { id: $appId }) {
      id
      dbHost
      dbName
      dbUser
      dbPassword
      dbPort
      authProvider
      serverSettings {
        generateGraphQL
        generateRestApi
        serverPath
      }
      adminUISettings {
        generateAdminUI
        adminUIPath
      }
    }
  }
`;

export const GET_APP_SETTINGS = gql`
  query appSettings($id: String!) {
    appSettings(where: { id: $id }) {
      id
      dbHost
      dbName
      dbUser
      dbPassword
      dbPort
      authProvider
      serverSettings {
        generateGraphQL
        generateRestApi
        serverPath
      }
      adminUISettings {
        generateAdminUI
        adminUIPath
      }
    }
  }
`;
