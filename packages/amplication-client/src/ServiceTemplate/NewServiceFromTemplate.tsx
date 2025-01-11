import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumTextAlign,
  FlexItem,
  SelectField,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback, useContext, useMemo } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./NewServiceFromTemplate.scss";
import useAvailableServiceTemplates from "./hooks/useAvailableServiceTemplates";

type CreateType = Omit<
  models.ServiceFromTemplateCreateInput,
  "project" | "serviceTemplate"
> & {
  serviceTemplateId: string;
};

type Props = {
  serviceTemplateId?: string;
  projectId: string;
};

const INITIAL_VALUES: CreateType = {
  name: "",
  description: "",
  serviceTemplateId: "",
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

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const CLASS_NAME = "new-service-from-template";

const NewServiceFromTemplate = ({ serviceTemplateId, projectId }: Props) => {
  const {
    createServiceFromTemplate,
    errorCreateServiceFromTemplate,
    loadingCreateServiceFromTemplate,
    currentProject,
  } = useContext(AppContext);

  const { availableTemplates } = useAvailableServiceTemplates(currentProject);

  const options = useMemo(() => {
    return availableTemplates.map((serviceTemplate) => ({
      value: serviceTemplate.id,
      label: serviceTemplate.name,
    }));
  }, [availableTemplates]);

  const handleSubmit = useCallback(
    (data: CreateType) => {
      createServiceFromTemplate({
        name: data.name,
        description: data.description,
        project: { connect: { id: projectId } },
        serviceTemplate: { id: data.serviceTemplateId },
      });
    },
    [createServiceFromTemplate, projectId]
  );

  const errorMessage = formatError(errorCreateServiceFromTemplate);

  const initialValues = {
    ...INITIAL_VALUES,
    serviceTemplateId: serviceTemplateId || options[0]?.value,
  };

  return (
    <div className={CLASS_NAME}>
      <SvgThemeImage image={EnumImages.AddResource} />
      <FlexItem margin={EnumFlexItemMargin.Bottom}>
        <Text textAlign={EnumTextAlign.Center}>
          Choose a template and name your new service
        </Text>
      </FlexItem>
      <Formik
        initialValues={initialValues}
        validate={(values: CreateType) => validate(values, FORM_SCHEMA)}
        onSubmit={handleSubmit}
        validateOnMount={false}
        validateOnBlur={false}
        validateOnChange={false}
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
                  label="Service Template"
                  name="serviceTemplateId"
                />
              </div>
              <TextField
                name="name"
                label="New Service Name"
                disabled={loadingCreateServiceFromTemplate}
                autoFocus
                hideLabel
                placeholder="Service Name"
                autoComplete="off"
              />
              <FlexItem
                direction={EnumFlexDirection.Column}
                margin={EnumFlexItemMargin.None}
              >
                <Button
                  type="submit"
                  buttonStyle={EnumButtonStyle.Primary}
                  disabled={loadingCreateServiceFromTemplate}
                >
                  Create Service
                </Button>
              </FlexItem>
            </Form>
          );
        }}
      </Formik>
      <Snackbar
        open={Boolean(errorCreateServiceFromTemplate)}
        message={errorMessage}
      />
    </div>
  );
};

export default NewServiceFromTemplate;
