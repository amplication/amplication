import {
  Snackbar,
  Panel,
  EnumPanelStyle,
  TextField,
} from "@amplication/design-system";
import { Form, Formik } from "formik";
import React from "react";
import * as models from "../../models";
import { formatError } from "../../util/error";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import "./GenerationSettingsForm.scss";
import useProjectConfigSettingsHook from "../useProjectConfigSettingsHook";

const CLASS_NAME = "generation-settings-form";

const DirectoriesProjectConfigurationSettingsForm: React.FC<{}> = () => {
  const {
    handleSubmit,
    PROJECT_CONFIG_FORM_SCHEMA,
    projectConfigurationData,
    projectConfigurationError,
    ProjectConfigurationUpdateError,
  } = useProjectConfigSettingsHook();

  return (
    <div className={CLASS_NAME}>
      {projectConfigurationData?.projectConfigurationSettings && (
        <Formik
          initialValues={projectConfigurationData.projectConfigurationSettings}
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
                      projectConfigurationData?.projectConfigurationSettings
                        .baseDirectory || ""
                    }
                    helpText={
                      projectConfigurationData?.projectConfigurationSettings
                        .baseDirectory
                    }
                    labelType="normal"
                  />
                </Panel>
              </Form>
            );
          }}
        </Formik>
      )}
      <Snackbar
        open={Boolean(projectConfigurationError)}
        message={formatError(
          projectConfigurationError || ProjectConfigurationUpdateError
        )}
      />
    </div>
  );
};

export default DirectoriesProjectConfigurationSettingsForm;
