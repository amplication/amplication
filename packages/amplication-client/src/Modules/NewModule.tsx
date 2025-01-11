import {
  Dialog,
  EnumTextAlign,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { pascalCase } from "pascal-case";
import { useCallback, useState } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { REACT_APP_FEATURE_CUSTOM_ACTIONS_ENABLED } from "../env";
import * as models from "../models";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import useModule from "./hooks/useModule";
import { useModulesContext } from "./modulesContext";
import "./NewModule.scss";

type Props = {
  resourceId: string;
  onModuleCreated?: (module: models.Module) => void;
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

const INITIAL_VALUES: Partial<models.Module> = {
  name: "",
  displayName: "",
  description: "",
};

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const CLASS_NAME = "new-module";

const NewModule = ({ resourceId, onModuleCreated }: Props) => {
  const history = useHistory();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resourceId });

  const { customActionsLicenseEnabled } = useModulesContext();

  const {
    createModule,
    createModuleError: error,
    createModuleLoading: loading,
  } = useModule();

  const handleDialogStateChange = useCallback(() => {
    setDialogOpen(!dialogOpen);
  }, [dialogOpen, setDialogOpen]);

  const handleSubmit = useCallback(
    (data) => {
      const displayName = data.displayName.trim();
      const name = pascalCase(displayName);

      createModule({
        variables: {
          data: {
            ...data,
            displayName,
            name,
            resource: { connect: { id: resourceId } },
          },
        },
      })
        .catch(console.error)
        .then((result) => {
          if (result && result.data) {
            if (onModuleCreated) {
              onModuleCreated(result.data.createModule);
            }
            history.push(`${baseUrl}/modules/${result.data.createModule.id}`);
          }
        });
      setDialogOpen(false);
    },
    [createModule, resourceId, onModuleCreated, setDialogOpen, baseUrl, history]
  );

  const errorMessage = formatError(error);

  return (
    <>
      <Dialog
        isOpen={dialogOpen}
        onDismiss={handleDialogStateChange}
        title="New Module"
      >
        <div className={`${CLASS_NAME}__module-dialog`}>
          <SvgThemeImage image={EnumImages.Entities} />
          <Text textAlign={EnumTextAlign.Center}>
            Give your new Module a descriptive name. <br /> For example:
            Customer, Order
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
                    label="New Module Name"
                    disabled={loading}
                    autoFocus
                    hideLabel
                    placeholder="Type New Module Name"
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    buttonStyle={EnumButtonStyle.Primary}
                    disabled={!formik.isValid || loading}
                  >
                    Create Module
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Dialog>
      {REACT_APP_FEATURE_CUSTOM_ACTIONS_ENABLED === "true" && (
        <Button
          buttonStyle={EnumButtonStyle.Outline}
          onClick={handleDialogStateChange}
          disabled={!customActionsLicenseEnabled}
          icon="box"
        >
          Add Module
        </Button>
      )}

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default NewModule;
