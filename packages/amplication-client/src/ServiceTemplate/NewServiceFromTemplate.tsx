import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumTextAlign,
  FlexItem,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback, useContext } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { useCatalogContext } from "../Catalog/CatalogContext";
import { Button, EnumButtonStyle } from "../Components/Button";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import TemplateSelectField from "../Components/TemplateSelectField";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./NewServiceFromTemplate.scss";

type CreateType = Omit<
  models.ResourceFromTemplateCreateInput,
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

  const { reloadCatalog } = useCatalogContext();

  const handleSubmit = useCallback(
    (data: CreateType) => {
      createServiceFromTemplate({
        name: data.name,
        description: data.description,
        project: { connect: { id: projectId } },
        serviceTemplate: { id: data.serviceTemplateId },
      }).then((resource) => {
        reloadCatalog();
      });
    },
    [createServiceFromTemplate, projectId, reloadCatalog]
  );

  const errorMessage = formatError(errorCreateServiceFromTemplate);

  const initialValues = {
    ...INITIAL_VALUES,
    serviceTemplateId: serviceTemplateId,
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
                <TemplateSelectField
                  projectId={currentProject?.id}
                  name="serviceTemplateId"
                  label="Service Template"
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
