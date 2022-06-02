import {
  Snackbar,
  Panel,
  EnumPanelStyle,
  ToggleField,
} from "@amplication/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
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

  const handleSubmit = useCallback(
    (data: models.AppSettings) => {
      const {
        dbHost,
        dbName,
        dbPassword,
        dbPort,
        dbUser,
        authProvider,
        generateAdminUI,
        generateGraphQL,
        generateRestApi,
        generateRootFiles,
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
            generateAdminUI,
            generateGraphQL,
            generateRestApi,
            generateRootFiles,
          },
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [updateAppSettings, applicationId, trackEvent]
  );

  const errorMessage = formatError(error || updateError);
  const GraphQLEnable = data?.appSettings.generateGraphQL;

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
                <h3>APIs Admin UI Settings</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis.
                  Class aptent taciti sociosqu ad litora torquent per conubia
                  nostra, per inceptos himenaeos.
                </p>
                <FormikAutoSave debounceMS={2000} />
                <Panel panelStyle={EnumPanelStyle.Transparent}>
                  <h2>Server</h2>
                  <ToggleField name="generateGraphQL" label="GraphQL API" />
                  <ToggleField
                    name="generateRestApi"
                    label="REST API & Swagger UI"
                  />
                </Panel>
                <Panel panelStyle={EnumPanelStyle.Transparent}>
                  <h2>Admin UI</h2>
                  <ToggleField
                    disabled={!GraphQLEnable}
                    name="generateAdminUI"
                    label="Admin UI"
                  />
                </Panel>
              </Form>
            );
          }}
        </Formik>
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
}

export default GenerationSettingsForm;

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
      generateAdminUI
      generateGraphQL
      generateRestApi
      generateRootFiles
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
      generateAdminUI
      generateGraphQL
      generateRestApi
      generateRootFiles
    }
  }
`;
