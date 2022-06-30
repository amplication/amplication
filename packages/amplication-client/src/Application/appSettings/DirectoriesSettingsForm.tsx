import {
  Snackbar,
  Panel,
  EnumPanelStyle,
  TextField,
} from "@amplication/design-system";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useCallback, useContext } from "react";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import { match } from "react-router-dom";
import PendingChangesContext from "../../VersionControl/PendingChangesContext";
import "./GenerationSettingsForm.scss";
import FORM_SCHEMA from "./formSchema";
import { GET_APP_SETTINGS, UPDATE_APP_SETTINGS } from "./GenerationSettingsForm";

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
      }
    }
  );

    

  const handleSubmit = useCallback(
    (data: models.AppSettings) => {
      const {
        dbHost,
        dbName,
        dbPassword,
        dbPort,
        dbUser,
        authProvider,
        adminUISettings: { generateAdminUI, adminUIPath },
        serverSettings: { generateRestApi, generateGraphQL, serverPath },
      } = data;

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
            adminUISettings: {
              generateAdminUI,
              adminUIPath: adminUIPath || ""
            },
            serverSettings: {
              generateRestApi,
              generateGraphQL,
              serverPath: serverPath || ""
            },
          },
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [updateAppSettings, applicationId, trackEvent]
  );

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
                  <h3>Base directories</h3>
                </div>
                <p className={`${CLASS_NAME}__description`}>
                  Amplication gives you the choice of which components to
                  generate. Use the settings to include or exclude GraphQL API,
                  REST API, and Admin UI.
                </p>
                <hr />
                <FormikAutoSave debounceMS={1000} />
                <Panel panelStyle={EnumPanelStyle.Transparent}>
                  <h2>Server</h2>
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="serverSettings[serverPath]"
                    placeholder="./packages/[SERVICE-NAME]"
                    label="Server base URL"
                    value={data?.appSettings.serverSettings.serverPath || ""}
                    helpText={data?.appSettings.serverSettings.serverPath}
                    labelType="normal"
                  />
                </Panel>
                <hr />
                <Panel panelStyle={EnumPanelStyle.Transparent}>
                  <h2>Admin UI</h2>
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="adminUISettings[adminUIPath]"
                    placeholder="./packages/[SERVICE-NAME]"
                    label="Admin UI base URL"
                    disabled={!data?.appSettings.serverSettings.generateGraphQL}
                    value={data?.appSettings.adminUISettings.adminUIPath || ""}
                    helpText={data?.appSettings.adminUISettings.adminUIPath}
                    labelType="normal"
                  />
                </Panel>
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
