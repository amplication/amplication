import {
  Snackbar,
  Panel,
  EnumPanelStyle,
  TextField,
} from "@amplication/design-system";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import * as models from "../../models";
import { formatError } from "../../util/error";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import "./GenerationSettingsForm.scss";
import { AppContext } from "../../context/appContext";
import useProjectConfigSettingsHook, {
  GET_PROJECT_CONFIG_SETTINGS,
  UPDATE_PROJECT_CONFIG_SETTINGS,
} from "../useProjectConfigSettingsHook";

type TData = {
  updateProjectConfigurationSettings: models.ProjectConfigurationSettings;
};

const CLASS_NAME = "generation-settings-form";

const DirectoriesProjectConfigurationSettingsForm: React.FC<{}> = () => {
  const { currentResource, addBlock } = useContext(AppContext);
  const resourceId = currentResource?.id;
  const { data, error } = useQuery<{
    projectConfigurationSettings: models.ProjectConfigurationSettings;
  }>(GET_PROJECT_CONFIG_SETTINGS, {
    variables: {
      id: currentResource?.id,
    },
    skip: !currentResource?.id,
  });

  const [updateResourceSettings, { error: updateError }] = useMutation<TData>(
    UPDATE_PROJECT_CONFIG_SETTINGS,
    {
      onCompleted: (data) => {
        addBlock(data.updateProjectConfigurationSettings.id);
      },
    }
  );

  const {
    handleSubmit,
    PROJECT_CONFIG_FORM_SCHEMA,
  } = useProjectConfigSettingsHook({
    resourceId,
    updateResourceSettings,
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
                <hr />
                <FormikAutoSave debounceMS={1000} />
                <Panel panelStyle={EnumPanelStyle.Transparent}>
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
