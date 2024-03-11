import {
  Dialog,
  EnumTextAlign,
  SelectField,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { ReactNode, useCallback, useMemo } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./NewModuleChild.scss";
import useModule from "./hooks/useModule";

type Props<T> = {
  resourceId: string;
  moduleId: string;
  validationSchema: { [key: string]: any };
  initialValues: Partial<T>;
  loading: boolean;
  errorMessage: string | undefined;
  typeName: string;
  description: string | ReactNode;
  onCreate?: (data: T, moduleId: string) => void;
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
      const { moduleId, ...rest } = data;
      onCreate && onCreate(rest, moduleId);
    },
    [onCreate]
  );

  const { findModulesData } = useModule();

  const options = useMemo(() => {
    if (findModulesData) {
      return findModulesData.modules.map((module) => ({
        label: `${module.displayName}`,
        value: module.id,
      }));
    }
    return [];
  }, [findModulesData]);

  const initialValueWithModuleId = useMemo(() => {
    const firstModule = findModulesData?.modules[0].id;

    return {
      ...initialValues,
      moduleId: moduleId || firstModule,
    };
  }, [findModulesData?.modules, initialValues, moduleId]);

  return (
    <div>
      <Dialog isOpen={true} onDismiss={onDismiss} title={`New ${typeName}`}>
        <div className={`${CLASS_NAME}`}>
          <SvgThemeImage image={EnumImages.Generating} />
          <Text textAlign={EnumTextAlign.Center}>{description}</Text>

          <Formik
            initialValues={initialValueWithModuleId}
            validate={(values) => validate(values, validationSchema)}
            onSubmit={handleSubmit}
          >
            {(formik) => {
              const handlers = {
                SUBMIT: formik.submitForm,
              };
              return (
                <Form>
                  <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
                  <div>
                    <SelectField
                      options={options}
                      label="Module"
                      name="moduleId"
                    />
                  </div>
                  <TextField
                    name="displayName"
                    label={`New ${typeName} Name`}
                    disabled={loading}
                    autoFocus
                    placeholder={`Type New ${typeName} Name`}
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    buttonStyle={EnumButtonStyle.Primary}
                    disabled={!formik.isValid || loading}
                  >
                    Create {typeName}
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
