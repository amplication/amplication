import {
  Button,
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumPanelStyle,
  EnumTextStyle,
  FlexItem,
  Form,
  FormColumns,
  HorizontalRule,
  Panel,
  SelectField,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { useCallback } from "react";
import BlueprintSelectField from "../../Blueprints/BlueprintSelectField";
import { DisplayNameField } from "../../Components/DisplayNameField";
import ProjectSelectField from "../../Components/ProjectSelectField";
import CustomPropertiesFormFields from "../../CustomProperties/CustomPropertiesFormFields";
import { validate } from "../../util/formikValidateJsonSchema";
import ResourceGitSettingsWithOverrideWizard from "../git/ResourceGitSettingsWithOverrideWizard";
import { ResourceSettingsFormFields } from "./ResourceSettingsFormFields";

export type CreateResourceType = {
  name: string;
  description?: string;
  projectId: string;
  blueprintId: string;
  properties?: Record<string, any>;
  settings: {
    properties: Record<string, any>;
  };
};

const FORM_SCHEMA = {
  required: ["name", "blueprintId", "projectId"],
  properties: {
    blueprintId: {
      type: "string",
    },
    projectId: {
      type: "string",
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
  },
  errorMessage: {
    properties: {
      name: "This field is required",
    },
  },
};

const DEFAULT_VALUES: Partial<CreateResourceType> = {
  name: "",
  description: "",
};

type Props = {
  projectId?: string;
};
const CreateResourceForm = ({ projectId }: Props) => {
  const handleSubmit = useCallback((values: CreateResourceType) => {
    console.log("CreateResourceForm handleSubmit");
    console.log(values);
  }, []);

  const initialValue = {
    ...DEFAULT_VALUES,
    projectId: projectId,
  };

  return (
    <>
      <Text textStyle={EnumTextStyle.H3}>
        Create a new resource in the catalog
      </Text>
      <Text textStyle={EnumTextStyle.Description}>
        Resources are the building blocks of your application. They can be
        databases, APIs, services, or any other component that your application
        needs.
      </Text>
      <Formik
        initialValues={initialValue}
        validate={(values: CreateResourceType) => validate(values, FORM_SCHEMA)}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form childrenAsBlocks>
            <HorizontalRule />
            <div>
              <FlexItem margin={EnumFlexItemMargin.Both}>
                <Text textStyle={EnumTextStyle.H4}>General</Text>
              </FlexItem>
              <Panel panelStyle={EnumPanelStyle.Bordered}>
                <FormColumns>
                  <DisplayNameField name="name" label="Name" minLength={1} />
                  <BlueprintSelectField
                    name="blueprintId"
                    label="Blueprint"
                    isMulti={false}
                  />
                  <ProjectSelectField name="projectId" label="Project" />
                  <SelectField name="Owner" label="owner" options={[]} />
                  <TextField
                    name={"description"}
                    label={"Description"}
                    autoComplete="off"
                    textarea
                    textareaSize="small"
                    rows={3}
                  />
                </FormColumns>
                {/* <OwnerSelector resource={{}} /> */}
              </Panel>
            </div>
            <div>
              <FlexItem margin={EnumFlexItemMargin.Both}>
                <Text textStyle={EnumTextStyle.H4}>
                  Connect to Git Repository
                </Text>
              </FlexItem>
              <Panel panelStyle={EnumPanelStyle.Bordered}>
                <ResourceGitSettingsWithOverrideWizard
                  formik={formik}
                  gitRepositoryDisconnectedCb={() => {}}
                  gitRepositoryCreatedCb={() => {}}
                  gitRepositorySelectedCb={() => {}}
                />
              </Panel>
            </div>
            <ResourceSettingsFormFields
              fieldNamePrefix="settings."
              blueprintId={formik.values.blueprintId}
            />

            <div>
              <FlexItem margin={EnumFlexItemMargin.Both}>
                <Text textStyle={EnumTextStyle.H4}>Catalog Properties</Text>
              </FlexItem>
              <Panel panelStyle={EnumPanelStyle.Bordered}>
                <FormColumns>
                  <CustomPropertiesFormFields />
                </FormColumns>
              </Panel>
            </div>
            <HorizontalRule />
            <div>
              <FlexItem
                end={
                  <Button
                    type="submit"
                    buttonStyle={EnumButtonStyle.Primary}
                    disabled={!formik.isValid || !formik.dirty}
                  >
                    Create Resource
                  </Button>
                }
              ></FlexItem>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateResourceForm;
