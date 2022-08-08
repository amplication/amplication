import {
  Snackbar,
  Panel,
  EnumPanelStyle,
  TextField,
} from "@amplication/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useContext, useEffect } from "react";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import "./GenerationSettingsForm.scss";
import { AppContext } from "../../context/appContext";
import useProjectConfigSettingsHook from "../useProjectConfigSettingsHook";

type TData = {
  updateProjectConfigurationSettings: models.ProjectConfigurationSettings;
};

const CLASS_NAME = "generation-settings-form";

const DirectoriesProjectConfigurationSettingsForm: React.FC<{}> = () => {
  const { currentResource, addBlock } = useContext(AppContext);
  const { data, error } = useQuery<{
    projectConfigurationSettings: models.ProjectConfigurationSettings;
  }>(GET_PROJECT_CONFIG_SETTINGS, {
    variables: {
      id: currentResource?.id,
    },
  });
  const { trackEvent } = useTracking();

  const [updateResourceSettings, { error: updateError }] = useMutation<TData>(
    UPDATE_PROJECT_CONFIG_SETTINGS,
    {
      onCompleted: (data) => {
        console.log({ data });
        addBlock(data.updateProjectConfigurationSettings.id);
      },
    }
  );
  const resourceId = currentResource?.id;

  useEffect(() => {
    if (!currentResource || !resourceId) {
      return;
    }
  }, [currentResource, resourceId]);

  const {
    handleSubmit,
    PROJECT_CONFIG_FORM_SCHEMA,
  } = useProjectConfigSettingsHook({
    trackEvent,
    updateResourceSettings,
    resourceId,
  });

  return (
    <div className={CLASS_NAME}>
      {data?.projectConfigurationSettings && (
        <Formik
          initialValues={data.projectConfigurationSettings}
          validate={(values: models.ProjectConfigurationSettings) =>
            validate(values, PROJECT_CONFIG_FORM_SCHEMA)
          }
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <div className={`${CLASS_NAME}__header`}>
                  <h3>Base Directory</h3>
                </div>
                <label>some description text</label>
                <FormikAutoSave debounceMS={1000} />
                <Panel panelStyle={EnumPanelStyle.Transparent}>
                  <h2>Base directory</h2>
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="baseDirectory"
                    placeholder="./"
                    label="Base directory"
                    value={
                      data?.projectConfigurationSettings.baseDirectory || ""
                    }
                    helpText={data?.projectConfigurationSettings.baseDirectory}
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
};

export default DirectoriesProjectConfigurationSettingsForm;

export const UPDATE_PROJECT_CONFIG_SETTINGS = gql`
  mutation updateProjectConfigurationsSettings(
    $data: ProjectConfigurationSettingsUpdateInput!
    $resourceId: String!
  ) {
    updateProjectConfigurationSettings(
      data: $data
      where: { id: $resourceId }
    ) {
      id
      baseDirectory
    }
  }
`;

export const GET_PROJECT_CONFIG_SETTINGS = gql`
  query projectConfigurationSettings($id: String!) {
    projectConfigurationSettings(where: { id: $id }) {
      id
      baseDirectory
    }
  }
`;
