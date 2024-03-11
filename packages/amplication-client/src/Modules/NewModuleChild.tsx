import {
  Dialog,
  EnumTextAlign,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { ReactNode, useCallback } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./NewModuleChild.scss";

type Props<T> = {
  resourceId: string;
  moduleId: string;
  validationSchema: { [key: string]: any };
  initialValues: Partial<T>;
  loading: boolean;
  errorMessage: string | undefined;
  typeName: string;
  description: string | ReactNode;
  onCreate?: (data: T) => void;
  onDismiss?: () => void;
};

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const CLASS_NAME = "new-module-child";

const NewModuleChild = <T,>({
  resourceId,
  moduleId,
  validationSchema,
  initialValues,
  loading,
  errorMessage,
  typeName,
  description,
  onCreate,
  onDismiss,
}: Props<T>) => {
  const handleSubmit = useCallback(
    (data) => {
      onCreate && onCreate(data);
    },
    [onCreate]
  );

  return (
    <div>
      <Dialog isOpen={true} onDismiss={onDismiss} title={`New ${typeName}`}>
        <div className={`${CLASS_NAME}`}>
          <SvgThemeImage image={EnumImages.Generating} />
          <Text textAlign={EnumTextAlign.Center}>{description}</Text>

          <Formik
            initialValues={initialValues}
            validate={(values) => validate(values, validationSchema)}
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
                    label={`New ${typeName} Name`}
                    disabled={loading}
                    autoFocus
                    hideLabel
                    placeholder={`Type New ${typeName} Name`}
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    buttonStyle={EnumButtonStyle.Primary}
                    disabled={!formik.isValid || loading}
                  >
                    Create ${typeName}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Dialog>

      <Snackbar open={!!errorMessage} message={errorMessage} />
    </div>
  );
};

export default NewModuleChild;
