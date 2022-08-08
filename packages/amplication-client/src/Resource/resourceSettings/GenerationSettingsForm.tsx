import { Snackbar, ToggleField } from "@amplication/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import { match } from "react-router-dom";
import "./GenerationSettingsForm.scss";
import useSettingsHook from "../useSettingsHook";
import { AppContext } from "../../context/appContext";

type Props = {
  match: match<{ resource: string }>;
};

type TData = {
  updateServiceSettings: models.ServiceSettings;
};

const CLASS_NAME = "generation-settings-form";

function GenerationSettingsForm({ match }: Props) {
  const resourceId = match.params.resource;

  const { data, error } = useQuery<{
    serviceSettings: models.ServiceSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: resourceId,
    },
  });
  const { addBlock } = useContext(AppContext);
  const { trackEvent } = useTracking();

  const [updateResourceSettings, { error: updateError }] = useMutation<TData>(
    UPDATE_SERVICE_SETTINGS,
    {
      onCompleted: (data) => {
        addBlock(data.updateServiceSettings.id);
      },
    }
  );

  const { handleSubmit, SERVICE_CONFIG_FORM_SCHEMA } = useSettingsHook({
    trackEvent,
    updateResourceSettings,
    resourceId,
  });

  return (
    <div className={CLASS_NAME}>
      {data?.serviceSettings && (
        <Formik
          initialValues={data.serviceSettings}
          validate={(values: models.ServiceSettings) =>
            validate(values, SERVICE_CONFIG_FORM_SCHEMA)
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
                    disabled={
                      !data?.serviceSettings.serverSettings.generateGraphQL
                    }
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

export const UPDATE_SERVICE_SETTINGS = gql`
  mutation updateServiceSettings(
    $data: ServiceSettingsUpdateInput!
    $resourceId: String!
  ) {
    updateServiceSettings(data: $data, where: { id: $resourceId }) {
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

export const GET_RESOURCE_SETTINGS = gql`
  query serviceSettings($id: String!) {
    serviceSettings(where: { id: $id }) {
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
