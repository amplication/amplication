import {
  Button,
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumMessageType,
  EnumPanelStyle,
  EnumTextStyle,
  FlexItem,
  Form,
  FormColumns,
  HorizontalRule,
  Panel,
  SelectField,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { useCallback, useMemo, useState } from "react";
import BlueprintSelectField from "../../Blueprints/BlueprintSelectField";
import { DisplayNameField } from "../../Components/DisplayNameField";
import ProjectSelectField from "../../Components/ProjectSelectField";
import CustomPropertiesFormFields from "../../CustomProperties/CustomPropertiesFormFields";
import { validate } from "../../util/formikValidateJsonSchema";
import ResourceGitSettingsWithOverrideWizard from "../git/ResourceGitSettingsWithOverrideWizard";
import { CreateResourceFormResourceSettings } from "./CreateResourceFormResourceSettings";
import * as models from "../../models";
import { EnumResourceType } from "@amplication/code-gen-types";
import useCreateComponent from "./hooks/useCreateComponent";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";
import { useHistory } from "react-router-dom";
import { useCatalogContext } from "../../Catalog/CatalogContext";
import { useAppContext } from "../../context/appContext";
import getPropertiesValidationSchemaUtil from "../../CustomProperties/getPropertiesValidationSchemaUtil";
import { formatError } from "../../util/error";

// This must be here unless we get rid of deepdash as it does not support ES imports
// eslint-disable-next-line @typescript-eslint/no-var-requires
const omitDeep = require("deepdash/omitDeep");

type GitSettingsType = Omit<models.ConnectGitRepositoryInput, "name"> & {
  gitRepositoryName?: string;
};

const GIT_SETTINGS_KEYS = [
  "gitOrganizationId",
  "groupName",
  "isOverrideGitRepository",
  "gitRepositoryName",
];

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "gitProvider",
  "connectToDemoRepo",
  "gitRepositoryUrl",
];

export type CreateResourceType = Omit<
  models.ResourceCreateInput,
  "serviceSettings" | "gitRepository" | "resourceType" | "codeGenerator"
> & {
  settings: {
    properties: Record<string, any>;
  };
  properties: Record<string, any>;
};

export type CreateResourceFormType = CreateResourceType & GitSettingsType;

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    blueprint: {
      type: "object",
      properties: {
        connect: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
          },
        },
      },
    },
    project: {
      type: "object",
      properties: {
        connect: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
          },
        },
      },
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

const GIT_DEFAULT_VALUES: models.ConnectGitRepositoryInput = {
  gitOrganizationId: "",
  name: "",
  resourceId: "",
};

const DEFAULT_VALUES: Partial<CreateResourceFormType> = {
  name: "",
  description: "",
  settings: {
    properties: {},
  },
  properties: {},
  gitOrganizationId: "",
  blueprint: {
    connect: {
      id: "",
    },
  },
  project: {
    connect: {
      id: "",
    },
  },
};

type Props = {
  projectId?: string;
};
const CreateResourceForm = ({ projectId }: Props) => {
  const { baseUrl } = useProjectBaseUrl();
  const history = useHistory();
  const { reloadCatalog } = useCatalogContext();

  const {
    customPropertiesMap,
    blueprintsMap: { blueprintsMapById },
    currentWorkspace,
  } = useAppContext();

  const handleComponentCreated = useCallback(
    (component: models.Resource) => {
      reloadCatalog();
      history.push(`${baseUrl}/${component.id}`);
    },
    [baseUrl, history, reloadCatalog]
  );

  const propertiesSchema = useMemo(() => {
    return getPropertiesValidationSchemaUtil(
      Object.values(customPropertiesMap)
    );
  }, [customPropertiesMap]);

  const getValidationSchema = useCallback(
    (blueprintId: string) => {
      const blueprint = blueprintsMapById[blueprintId];

      const settingsSchema =
        blueprint &&
        getPropertiesValidationSchemaUtil(Object.values(blueprint.properties));

      const schema: any = {
        ...FORM_SCHEMA,
        properties: {
          ...FORM_SCHEMA.properties,
          properties: propertiesSchema.schema,
        },
      };

      if (settingsSchema) {
        schema.properties.settings = {
          type: "object",
          properties: {
            properties: settingsSchema.schema,
          },
        };
      }
      return schema;
    },
    [blueprintsMapById, propertiesSchema.schema]
  );

  const { createComponent, loadingCreateComponent, errorCreateComponent } =
    useCreateComponent({
      onComponentCreated: handleComponentCreated,
    });

  const errorMessage = formatError(errorCreateComponent);

  const handleSubmit = useCallback(
    (values: CreateResourceFormType) => {
      const sanitizedValues = omitDeep(
        {
          ...values,
        },
        NON_INPUT_GRAPHQL_PROPERTIES
      );

      // Separate GitSettings and other props dynamically
      const gitSettings = {} as models.ConnectGitRepositoryInput;
      const createResourceProps = {} as CreateResourceType;

      Object.entries(sanitizedValues).forEach(([key, value]) => {
        if (GIT_SETTINGS_KEYS.includes(key)) {
          if (key === "gitRepositoryName") {
            //replace the key with the correct one
            gitSettings.name = value as string;
          } else {
            gitSettings[key] = value;
          }
        } else {
          createResourceProps[key] = value;
        }
      });

      const { settings, properties, ...resource } = createResourceProps;

      const preparedValues: models.ResourceCreateInput = {
        ...resource,
        gitRepository: {
          ...GIT_DEFAULT_VALUES,
          ...gitSettings,
        },
        resourceType: EnumResourceType.Component,
      };

      createComponent(preparedValues, properties, settings);
    },
    [createComponent]
  );

  const initialValue: Partial<CreateResourceFormType> = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      properties: Object.values(customPropertiesMap).reduce((acc, property) => {
        acc[property.key] = "";
        return acc;
      }, {}),
      settings: {
        properties: {},
      },
      project: {
        connect: {
          id: projectId,
        },
      },
      blueprint: {
        connect: {
          id: "",
        },
      },
    }),
    [customPropertiesMap, projectId]
  );

  const [initialValueWithSettings, setInitialValueWithSettings] =
    useState(initialValue);

  const handleProjectChange = useCallback(
    (projectId: string) => {
      history.push(`/${currentWorkspace?.id}/${projectId}/new-resource`);
    },
    [currentWorkspace?.id, history]
  );

  //reset the initial value of the form to include the new blueprint properties
  const handleBlueprintChange = useCallback(
    (blueprintId: string) => {
      if (blueprintId) {
        const blueprint = blueprintsMapById[blueprintId];
        if (blueprint) {
          const settingsInitialValue = {
            properties: blueprint.properties.reduce((acc, property) => {
              acc[property.key] = "";
              return acc;
            }, {}),
          };
          setInitialValueWithSettings({
            ...initialValue,
            settings: settingsInitialValue,
            blueprint: {
              connect: {
                id: blueprintId,
              },
            },
          });
        }
      }
    },
    [blueprintsMapById, initialValue]
  );

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
        initialValues={initialValueWithSettings}
        validate={(values: CreateResourceFormType) => {
          const validationSchema = getValidationSchema(
            values.blueprint?.connect?.id
          );
          return validate(values, validationSchema);
        }}
        enableReinitialize //this is needed to update the form when the blueprint changes
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form childrenAsBlocks>
            <HorizontalRule />
            <div>
              <FlexItem margin={EnumFlexItemMargin.Both}>
                <Text textStyle={EnumTextStyle.H4}>Project and Blueprint</Text>
              </FlexItem>
              <Panel panelStyle={EnumPanelStyle.Bordered}>
                <ProjectSelectField
                  name="project.connect.id"
                  label="Project"
                  onChange={handleProjectChange}
                />
                <BlueprintSelectField
                  name="blueprint.connect.id"
                  label="Blueprint"
                  isMulti={false}
                  onChange={(value) => handleBlueprintChange(value)}
                />
                <Text textStyle={EnumTextStyle.Description}>
                  {
                    blueprintsMapById[formik.values.blueprint.connect.id]
                      ?.description
                  }
                </Text>
              </Panel>
            </div>

            <div>
              <FlexItem margin={EnumFlexItemMargin.Both}>
                <Text textStyle={EnumTextStyle.H4}>Resource</Text>
              </FlexItem>
              <Panel panelStyle={EnumPanelStyle.Bordered}>
                <DisplayNameField name="name" label="Name" minLength={1} />
                <HorizontalRule />

                <SelectField name="Owner" label="owner" options={[]} />
                <CustomPropertiesFormFields disabled={false} />
                <TextField
                  name={"description"}
                  label={"Description"}
                  autoComplete="off"
                  textarea
                  textareaSize="small"
                  rows={3}
                />
                {/* <OwnerSelector resource={{}} /> */}
              </Panel>
            </div>

            <CreateResourceFormResourceSettings
              blueprintId={formik.values.blueprint.connect.id}
            />
            <div>
              <FlexItem margin={EnumFlexItemMargin.Both}>
                <Text textStyle={EnumTextStyle.H4}>Git Repository</Text>
              </FlexItem>
              <Panel panelStyle={EnumPanelStyle.Bordered}>
                <ResourceGitSettingsWithOverrideWizard formik={formik} />
              </Panel>
            </div>
            <HorizontalRule />
            <div>
              <FlexItem
                end={
                  <Button
                    type="submit"
                    buttonStyle={EnumButtonStyle.Primary}
                    disabled={!formik.dirty || loadingCreateComponent}
                  >
                    Create Resource
                  </Button>
                }
              ></FlexItem>
            </div>
          </Form>
        )}
      </Formik>
      <Snackbar
        messageType={EnumMessageType.Error}
        open={Boolean(errorCreateComponent)}
        message={errorMessage}
      />
    </>
  );
};

export default CreateResourceForm;
