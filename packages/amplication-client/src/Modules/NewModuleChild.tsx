import {
  Dialog,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumTextAlign,
  FlexItem,
  SelectField,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { Form, Formik, FormikProps } from "formik";
import { ReactNode, useCallback, useMemo } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./NewModuleChild.scss";
import useModule from "./hooks/useModule";
import CreateWithJovuButton from "../Assistant/CreateWithJovuButton";

type ModuleChildType = "Action" | "DTO" | "Enum";

type Props = {
  resourceId: string;
  moduleId: string;
  loading: boolean;
  errorMessage: string | undefined;
  typeName: ModuleChildType;
  description: string | ReactNode;
  onCreate?: (data: { displayName: string }, moduleId: string) => void;
  onDismiss?: () => void;
};

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const CLASS_NAME = "new-module-child";

const CREATE_WITH_JOVU_MESSAGE_MAP: { [key in ModuleChildType]: string } = {
  Action:
    "Create a new action named {displayName} in module {moduleName}. Suggest and create the required DTOs for Input and Output.",
  DTO: "Create a new DTO named {displayName} in module {moduleName}. Suggest and create the common properties that should be part of this DTO.",
  Enum: "Create a new enum named {displayName} in module {moduleName}. Suggest and create the enum members that should be part of this enum.",
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

const INITIAL_VALUES = {
  displayName: "",
};

const NewModuleChild = ({
  resourceId,
  moduleId,
  loading,
  errorMessage,
  typeName,
  description,
  onCreate,
  onDismiss,
}: Props) => {
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
    const firstModule = findModulesData?.modules[0]?.id;

    return {
      ...INITIAL_VALUES,
      moduleId: moduleId || firstModule,
    };
  }, [findModulesData?.modules, moduleId]);

  return (
    <div>
      <Dialog isOpen={true} onDismiss={onDismiss} title={`New ${typeName}`}>
        <div className={`${CLASS_NAME}`}>
          <SvgThemeImage image={EnumImages.Generating} />
          <Text textAlign={EnumTextAlign.Center}>{description}</Text>

          <Formik
            initialValues={initialValueWithModuleId}
            validate={(values) => validate(values, FORM_SCHEMA)}
            onSubmit={() => {}}
          >
            {(formik) => {
              return (
                <NewModuleChildForm
                  typeName={typeName}
                  formik={formik}
                  options={options}
                  loading={loading}
                  handleSubmit={handleSubmit}
                  onDismiss={onDismiss}
                />
              );
            }}
          </Formik>
        </div>
      </Dialog>

      <Snackbar open={!!errorMessage} message={errorMessage} />
    </div>
  );
};

type NewModuleChildFormProps = {
  typeName: ModuleChildType;
  handleSubmit: (data: any) => void;
  formik: FormikProps<{ displayName: string; moduleId: string }>;
  loading: boolean;
  onDismiss: () => void;
  options: { label: string; value: string }[];
};

const NewModuleChildForm = ({
  typeName,
  formik,
  options,
  loading,
  handleSubmit,
  onDismiss,
}: NewModuleChildFormProps) => {
  const jovuMessage = useMemo(() => {
    const displayName = formik.values.displayName;
    const moduleName = options.find(
      (option) => option.value === formik.values.moduleId
    )?.label;

    return CREATE_WITH_JOVU_MESSAGE_MAP[typeName]
      .replace("{displayName}", displayName)
      .replace("{moduleName}", moduleName);
  }, [formik.values.displayName, formik.values.moduleId, options, typeName]);

  const handlers = {
    SUBMIT: formik.submitForm,
  };

  return (
    <Form>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
      <div>
        <SelectField options={options} label="Module" name="moduleId" />
      </div>
      <TextField
        name="displayName"
        label={`New ${typeName} Name`}
        disabled={loading}
        autoFocus
        placeholder={`Type New ${typeName} Name`}
        autoComplete="off"
      />

      <FlexItem
        direction={EnumFlexDirection.Column}
        margin={EnumFlexItemMargin.None}
      >
        <Button
          type="submit"
          onClick={() => {
            handleSubmit(formik.values);
          }}
          buttonStyle={EnumButtonStyle.Primary}
          disabled={!formik.isValid || loading}
        >
          Create {typeName}
        </Button>
        <CreateWithJovuButton
          message={jovuMessage}
          onCreateWithJovuClicked={onDismiss}
          disabled={!formik.isValid || loading}
          eventOriginLocation={`New ${typeName} Dialog`}
        />
      </FlexItem>
    </Form>
  );
};

export default NewModuleChild;
