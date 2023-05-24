import { TextField } from "@amplication/ui/design-system";
import { gql, useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import { formatError } from "../util/error";
import React, { useCallback, useContext } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import {
  validate,
  validationErrorMessages,
} from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./NewProject.scss";

type CreateProjectType = models.ProjectCreateInput;

const INITIAL_VALUES: CreateProjectType = {
  name: "",
};

const { AT_LEAST_TWO_CHARARCTERS } = validationErrorMessages;

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
  },
  errorMessage: {
    properties: {
      name: AT_LEAST_TWO_CHARARCTERS,
    },
  },
};
const CLASS_NAME = "new-project";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

type DType = {
  createProject: models.Project;
};

type Props = {
  onProjectCreated: () => void;
};

const NewProject = ({ onProjectCreated }: Props) => {
  const { onNewProjectCompleted } = useContext(AppContext);
  const { trackEvent } = useTracking();
  const [createProject, { loading }] = useMutation<DType>(CREATE_PROJECT, {
    onCompleted: (data) => {
      trackEvent({
        eventName: AnalyticsEventNames.ProjectCreate,
        projectName: data.createProject.name,
      });
      onProjectCreated();
      onNewProjectCompleted(data.createProject);
    },
  });

  const handleSubmit = useCallback(
    (data: CreateProjectType, { setErrors }) => {
      createProject({
        variables: {
          data,
        },
      }).catch((err) => setErrors({ name: formatError(err) }));
    },
    [createProject]
  );

  return (
    <div className={CLASS_NAME}>
      <SvgThemeImage image={EnumImages.Entities} />
      <div className={`${CLASS_NAME}__instructions`}>
        Give your new project a descriptive name
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
                label="New Project Name"
                disabled={loading}
                autoFocus
                hideLabel
                placeholder="Type New Project Name"
                autoComplete="off"
              />
              <Button
                className={CLASS_NAME}
                type="submit"
                buttonStyle={EnumButtonStyle.Primary}
                disabled={!formik.isValid || loading}
              >
                Create new project
              </Button>
            </Form>
          );
        }}
      </Formik>
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
