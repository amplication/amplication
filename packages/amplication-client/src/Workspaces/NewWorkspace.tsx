import { TextField, Snackbar } from "@amplication/design-system";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import {
  CreateWorkspaceType,
  WORKSPACE_INITIAL_VALUES,
  WORKSPACE_FORM_SCHEMA,
} from "./hooks/workspace";
import "./NewWorkspace.scss";

const CLASS_NAME = "new-workspace";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const NewWorkspace = () => {
  const {
    createWorkspace,
    createNewWorkspaceError,
    loadingCreateNewWorkspace,
  } = useContext(AppContext);
  const errorMessage = formatError(createNewWorkspaceError);

  return (
    <div className={CLASS_NAME}>
      <SvgThemeImage image={EnumImages.Entities} />
      <div className={`${CLASS_NAME}__instructions`}>
        Give your new workspace a descriptive name.
      </div>
      <Formik
        initialValues={WORKSPACE_INITIAL_VALUES}
        validate={(values: CreateWorkspaceType) =>
          validate(values, WORKSPACE_FORM_SCHEMA)
        }
        onSubmit={createWorkspace}
        validateOnMount
        validateOnBlur={false}
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
                disabled={loadingCreateNewWorkspace}
                autoFocus
                hideLabel
                placeholder="Type New Workspace Name"
                autoComplete="off"
              />
              <Button
                type="submit"
                buttonStyle={EnumButtonStyle.Primary}
                disabled={!formik.isValid || loadingCreateNewWorkspace}
              >
                Create Workspace
              </Button>
            </Form>
          );
        }}
      </Formik>
      <Snackbar
        open={Boolean(createNewWorkspaceError)}
        message={errorMessage}
      />
    </div>
  );
};

export default NewWorkspace;
