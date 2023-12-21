import {
  Dialog,
  EnumTextAlign,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { pascalCase } from "pascal-case";
import { useCallback, useContext, useEffect, useState } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import useModuleAction from "./hooks/useModuleAction";
import { kebabCase } from "lodash";

type Props = {
  resourceId: string;
  moduleId: string;
};

const FORM_SCHEMA = {
  required: ["displayName"],
  properties: {
    displayName: {
      type: "string",
      minLength: 2,
    },
  },
};

const INITIAL_VALUES: Partial<models.ModuleAction> = {
  name: "",
  displayName: "",
  description: "",
};

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const NewModuleAction = ({ resourceId, moduleId }: Props) => {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const {
    createModuleAction,
    createModuleActionData: data,
    createModuleActionError: error,
    createModuleActionLoading: loading,
  } = useModuleAction();

  const handleDialogStateChange = useCallback(() => {
    setDialogOpen(!dialogOpen);
  }, [dialogOpen, setDialogOpen]);

  const handleSubmit = useCallback(
    (data) => {
      const displayName = data.displayName.trim();
      const name = pascalCase(displayName);

      createModuleAction({
        variables: {
          data: {
            ...data,
            displayName,
            name,
            gqlOperation: models.EnumModuleActionGqlOperation.Query,
            restVerb: models.EnumModuleActionRestVerb.Get,
            path: `/:id/${kebabCase(name)}`,
            resource: { connect: { id: resourceId } },
            parentBlock: { connect: { id: moduleId } },
          },
        },
      }).catch(console.error);
    },
    [createModuleAction, resourceId]
  );

  useEffect(() => {
    if (data) {
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${moduleId}/actions/${data.createModuleAction.id}`
      );
    }
  }, [history, data, resourceId, currentWorkspace, currentProject]);

  const errorMessage = formatError(error);

  return (
    <>
      <Dialog
        isOpen={dialogOpen}
        onDismiss={handleDialogStateChange}
        title="New Action"
      >
        <SvgThemeImage image={EnumImages.Entities} />
        <Text textAlign={EnumTextAlign.Center}>
          Give your new Action a descriptive name. <br />
          For example: Get Customer, Find Orders, Create Ticket...
        </Text>

        <Formik
          initialValues={INITIAL_VALUES}
          validate={(values) => validate(values, FORM_SCHEMA)}
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
                  name="displayName"
                  label="New Action Name"
                  disabled={loading}
                  autoFocus
                  hideLabel
                  placeholder="Type New Action Name"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  buttonStyle={EnumButtonStyle.Primary}
                  disabled={!formik.isValid || loading}
                >
                  Create Action
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Dialog>
      <Button
        buttonStyle={EnumButtonStyle.Primary}
        onClick={handleDialogStateChange}
        disabled={true}
      >
        Add Action
      </Button>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default NewModuleAction;
