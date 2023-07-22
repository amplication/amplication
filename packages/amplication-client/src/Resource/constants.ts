import { gql } from "@apollo/client";
import * as models from "../models";
import { EnumAuthProviderType } from "../models";
import { DefineUser } from "./create-resource/CreateServiceWizard";
import { TemplateSettings } from "./create-resource/wizardResourceSchema";
import { EnumGitProvider } from "../models";

export const serviceSettingsFieldsInitValues = {
  generateAdminUI: true,
  generateGraphQL: true,
  generateRestApi: true,
};

export const sampleServiceResourceWithEntities = [
  {
    name: "Orders",
    fields: [
      {
        name: "Quantity",
        dataType: models.EnumDataType.WholeNumber,
      },
      {
        name: "Discount",
        dataType: models.EnumDataType.DecimalNumber,
      },
      {
        name: "Total Price",
        dataType: models.EnumDataType.WholeNumber,
      },
    ],
    relationsToEntityIndex: [1, 3],
  },
  {
    name: "Customer",
    fields: [
      {
        name: "First Name",
        dataType: models.EnumDataType.SingleLineText,
      },
      {
        name: "Last Name",
        dataType: models.EnumDataType.SingleLineText,
      },
      {
        name: "Email",
        dataType: models.EnumDataType.Email,
      },
      {
        name: "Phone",
        dataType: models.EnumDataType.SingleLineText,
      },
    ],
    relationsToEntityIndex: [2],
  },
  {
    name: "Address",
    fields: [
      {
        name: "Address 1",
        dataType: models.EnumDataType.SingleLineText,
      },
      {
        name: "Address 2",
        dataType: models.EnumDataType.SingleLineText,
      },
      {
        name: "City",
        dataType: models.EnumDataType.SingleLineText,
      },
      {
        name: "State",
        dataType: models.EnumDataType.SingleLineText,
      },
      {
        name: "Zip",
        dataType: models.EnumDataType.WholeNumber,
      },
    ],
  },
  {
    name: "Product",
    fields: [
      {
        name: "Name",
        dataType: models.EnumDataType.SingleLineText,
      },
      {
        name: "Item Price",
        dataType: models.EnumDataType.DecimalNumber,
      },
      {
        name: "Description",
        dataType: models.EnumDataType.MultiLineText,
      },
    ],
  },
];

export type createServiceSettings = {
  generateAdminUI: boolean;
  generateGraphQL: boolean;
  generateRestApi: boolean;
  resourceType: string;
};

export function prepareServiceObject(
  serviceName: string,
  projectId: string,
  templateSettings: TemplateSettings,
  generateAdminUI: boolean,
  generateGraphQL: boolean,
  generateRestApi: boolean,
  gitRepository: models.ConnectGitRepositoryInput = null,
  serverDir: string,
  adminDir: string,
  plugins: models.PluginInstallationsCreateInput,
  wizardType: DefineUser,
  repoType: string,
  dbType: string,
  auth: string,
  connectToDemoRepo: boolean
  // gitOrganizationName: string
): models.ResourceCreateWithEntitiesInput {
  return {
    resource: {
      name: serviceName,
      description: templateSettings.description,
      resourceType: models.EnumResourceType.Service,
      project: {
        connect: {
          id: projectId,
        },
      },
      serviceSettings: {
        adminUISettings: {
          generateAdminUI: generateAdminUI,
          adminUIPath: adminDir,
        },
        serverSettings: {
          generateGraphQL: generateGraphQL,
          generateRestApi: generateRestApi,
          serverPath: serverDir,
        },
        authProvider: EnumAuthProviderType.Jwt,
      },
      gitRepository: gitRepository,
    },
    commitMessage: "",
    entities: templateSettings.entities,
    plugins: plugins,
    wizardType,
    repoType,
    dbType,
    authType: auth,
    connectToDemoRepo,
  };
}

export function prepareMessageBrokerObject(
  projectId: string
): models.ResourceCreateInput {
  return {
    name: "My message broker",
    description: "",
    resourceType: models.EnumResourceType.MessageBroker,
    project: {
      connect: {
        id: projectId,
      },
    },
  };
}

export const resourceThemeMap: {
  [key in models.EnumResourceType]: {
    icon: string;
    color: string;
  };
} = {
  [models.EnumResourceType.ProjectConfiguration]: {
    icon: "app-settings",
    color: "#FFBD70",
  },
  [models.EnumResourceType.Service]: {
    icon: "services",
    color: "#A787FF",
  },
  [models.EnumResourceType.MessageBroker]: {
    icon: "queue",
    color: "#8DD9B9",
  },
};

export const PROVIDERS_DISPLAY_NAME: {
  [key in EnumGitProvider]: string;
} = {
  [EnumGitProvider.AwsCodeCommit]: "AWS CodeCommit",
  [EnumGitProvider.Bitbucket]: "Bitbucket",
  [EnumGitProvider.Github]: "GitHub",
};
