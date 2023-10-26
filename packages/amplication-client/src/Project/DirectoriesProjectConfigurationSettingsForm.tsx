import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import React from "react";
import * as models from "../models";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import useProjectConfigSettingsHook from "./useProjectConfigSettingsHook";

const CLASS_NAME = "generation-settings-form";

const DirectoriesProjectConfigurationSettingsForm: React.FC = () => {
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
                <FlexItem margin={EnumFlexItemMargin.Bottom}>
                  <Text textStyle={EnumTextStyle.H4}>Base Directory</Text>
                </FlexItem>
                <Text textStyle={EnumTextStyle.Tag}>
                  Set the base path where the generated code will be located.
                  This will be the root directory for your generated files.
                </Text>
                <HorizontalRule />

                <FormikAutoSave debounceMS={1000} />
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
