import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Snackbar,
  Text,
  ToggleField,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import React, { useCallback } from "react";
import { useAppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import useProjectConfigSettingsHook from "./useProjectConfigSettingsHook";
import { useResourceContext } from "../context/resourceContext";

const CLASS_NAME = "generation-settings-form";

const ProjectAccessForm: React.FC = () => {
  const { currentProject } = useAppContext();

  const { permissions } = useResourceContext();
  const canEditProject = permissions.canPerformTask("project.settings.edit");

  const { updateProject, updateProjectError } = useProjectConfigSettingsHook();

  const handleSubmit = useCallback(
    (data: models.Project) => {
      updateProject({
        variables: {
          data,
          projectId: currentProject?.id,
        },
      }).catch(console.error);
    },
    [updateProject, currentProject?.id]
  );

  const formValue: Partial<models.Project> = {
    platformIsPublic: currentProject?.platformIsPublic,
  };

  return (
    <div className={CLASS_NAME}>
      {currentProject && (
        <Formik
          initialValues={formValue}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <FlexItem margin={EnumFlexItemMargin.Bottom}>
                  <Text textStyle={EnumTextStyle.H4}>Platform Access</Text>
                </FlexItem>
                <Text textStyle={EnumTextStyle.Tag}>
                  Choose whether to expose plugins and templates from this
                  project to other projects.
                </Text>
                <HorizontalRule />

                {canEditProject && <FormikAutoSave debounceMS={1000} />}
                <ToggleField
                  disabled={!canEditProject}
                  name="platformIsPublic"
                  label="Allow other projects to use plugins and templates from this project"
                />
              </Form>
            );
          }}
        </Formik>
      )}
      <Snackbar
        open={Boolean(updateProjectError)}
        message={formatError(updateProjectError)}
      />
    </div>
  );
};

export default ProjectAccessForm;
