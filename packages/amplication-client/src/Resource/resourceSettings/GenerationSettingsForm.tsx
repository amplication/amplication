import {
  EnumFlexDirection,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Snackbar,
  Text,
  ToggleField,
} from "@amplication/ui/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import { useContext } from "react";
import { match } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import useSettingsHook from "../useSettingsHook";

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
  const { currentResource, addBlock } = useContext(AppContext);
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

  const isDotNet =
    currentResource.codeGenerator === models.EnumCodeGenerator.DotNet;

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
                <Text textStyle={EnumTextStyle.H4}>
                  APIs & Admin UI Settings
                </Text>
                <Text textStyle={EnumTextStyle.Tag}>
                  Amplication gives you the choice of which components to
                  generate. Use the settings to include or exclude GraphQL API,
                  REST API, and Admin UI.
                </Text>
                {isDotNet && (
                  <div>
                    <Text
                      textStyle={EnumTextStyle.Description}
                      textColor={EnumTextColor.ThemeOrange}
                    >
                      GraphQL and Admin UI are currently not available with the
                      .NET generator. These features will be available soon.
                    </Text>
                  </div>
                )}
                <HorizontalRule />
                <FormikAutoSave debounceMS={200} />
                <FlexItem direction={EnumFlexDirection.Column}>
                  <ToggleField
                    name="serverSettings[generateRestApi]"
                    label="REST API & Swagger UI"
                  />
                  <ToggleField
                    name="serverSettings[generateGraphQL]"
                    label="GraphQL API"
                    disabled={isDotNet}
                  />
                  <ToggleField
                    disabled={
                      !data?.serviceSettings.serverSettings.generateGraphQL ||
                      isDotNet
                    }
                    name="adminUISettings[generateAdminUI]"
                    label="Admin UI"
                  />
                </FlexItem>
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
      authProvider
      authEntityName
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
      authProvider
      authEntityName
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
