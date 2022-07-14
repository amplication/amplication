import { TextField, Snackbar } from "@amplication/design-system";
import { gql, Reference, useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useCallback } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";

type CreateProjectType = models.ProjectCreateInput;

const INITIAL_VALUES: CreateProjectType = {
  name: "",
};

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
  },
};
const CLASS_NAME = "new-project-dialog";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

type DType = {
  createProject: models.Project;
};

const NewProject = () => {
  const { trackEvent } = useTracking();
  const [createProject, { error, loading }] = useMutation<DType>(
    CREATE_PROJECT,
    {
      onCompleted: (data) => {
        trackEvent({
          eventName: "createProject",
          projectName: data.createProject.name,
        });
      },
      update(cache, { data }) {
        if (!data) return;

        const newProject = data.createProject;

        cache.modify({
          fields: {
            workspaces(existingWorkspaceRefs = [], { readField }) {
              const newWorkspaceRef = cache.writeFragment({
                data: newProject,
                fragment: NEW_PROJECT_FRAGMENT,
              });

              if (
                existingWorkspaceRefs.some(
                  (WorkspaceRef: Reference) =>
                    readField("id", WorkspaceRef) === newProject.id
                )
              ) {
                return existingWorkspaceRefs;
              }

              return [...existingWorkspaceRefs, newWorkspaceRef];
            },
          },
        });
      },
    }
  );

  const handleSubmit = useCallback(
    (data: CreateProjectType) => {
      createProject({
        variables: {
          data,
        },
      }).catch(console.error);
    },
    [createProject]
  );
  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <SvgThemeImage image={EnumImages.Entities} />
      <div className={`${CLASS_NAME}__instructions`}>
        Give your new project a name
      </div>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: CreateProjectType) => validate(values, FORM_SCHEMA)}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {(formik) => {
          const handlers = {
            SUBMIT: formik.submitForm,
          };
          return (
            <Form>
              <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
              <TextField
                name="name"
                label="New Workspace Name"
                disabled={loading}
                autoFocus
                hideLabel
                placeholder="Type New Workspace Name"
                autoComplete="off"
              />
              <Button
                type="submit"
                buttonStyle={EnumButtonStyle.Primary}
                disabled={!formik.isValid || loading}
              >
                Create Project
              </Button>
            </Form>
          );
        }}
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default NewProject;

const CREATE_PROJECT = gql`
  mutation createProject($data: ProjectCreateInput!) {
    createProject(data: $data) {
      id
      name
    }
  }
`;

const NEW_PROJECT_FRAGMENT = gql`
  fragment NewProject on Project {
    id
    name
  }
`;
