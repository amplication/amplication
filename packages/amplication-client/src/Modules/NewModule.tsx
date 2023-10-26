import {
  EnumTextAlign,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { pascalCase } from "pascal-case";
import { useCallback, useContext, useEffect } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./NewModule.scss";
import useModule from "./hooks/useModule";

type Props = {
  resourceId: string;
  onSuccess: () => void;
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

const prepareName = (displayName: string) => {
  return pascalCase(displayName);
};

const NewModule = ({ resourceId, onSuccess }: Props) => {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const {
    createModule,
    createModuleData: data,
    createModuleError: error,
    createModuleLoading: loading,
  } = useModule();

  const handleSubmit = useCallback(
    (data) => {
      const name = prepareName(data.displayName);
      createModule({
        variables: {
          data: {
            ...data,
            displayName: name,
            name,
            resource: { connect: { id: resourceId } },
          },
        },
      });
    },
    [createModule, resourceId]
  );

  useEffect(() => {
    if (data) {
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${data.createModule.id}`
      );
    }
  }, [history, data, resourceId, currentWorkspace, currentProject]);

  const errorMessage = formatError(error);

  return (
    <div>
      <SvgThemeImage image={EnumImages.Entities} />
      <Text textAlign={EnumTextAlign.Center}>
        Give your new Module a descriptive name in a PascalCase format <br />
        For example: Customer, SupportTicket, PurchaseOrder.
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
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default NewModule;
