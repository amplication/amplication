import * as models from "../models";
import { EnumAuthProviderType, EnumGitProvider } from "../models";
import { WizardFlowType } from "./create-resource/types";

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
  generateAdminUI: boolean,
  generateGraphQL: boolean,
  generateRestApi: boolean,
  gitRepository: models.ConnectGitRepositoryInput = null,
  serverDir: string,
  adminDir: string,
  plugins: models.PluginInstallationsCreateInput,
  wizardType: WizardFlowType,
  repoType: string,
  dbType: string,
  auth: string,
  connectToDemoRepo: boolean,
  codeGenerator: models.EnumCodeGenerator = models.EnumCodeGenerator.NodeJs
): models.ResourceCreateWithEntitiesInput {
  return {
    resource: {
      name: serviceName,
      description: "",
      resourceType: models.EnumResourceType.Service,
      codeGenerator: codeGenerator,
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
    entities: [],
    plugins: plugins,
    wizardType,
    repoType,
    dbType,
    authType: auth,
    connectToDemoRepo,
  };
}

export function prepareServiceTemplateObject(
  serviceName: string,
  projectId: string,
  generateAdminUI: boolean,
  generateGraphQL: boolean,
  generateRestApi: boolean,
  serverDir: string,
  adminDir: string,
  plugins: models.PluginInstallationsCreateInput,
  codeGenerator: models.EnumCodeGenerator = models.EnumCodeGenerator.NodeJs
): models.ServiceTemplateCreateInput {
  return {
    resource: {
      name: serviceName,
      description: "",
      resourceType: models.EnumResourceType.ServiceTemplate,
      codeGenerator: codeGenerator,
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
    },
    plugins: plugins,
  };
}

export function prepareMessageBrokerObject(
  projectId: string
): models.ResourceCreateInput {
  return {
    name: "My message broker",
    description: "",
    resourceType: models.EnumResourceType.MessageBroker,
    codeGenerator: models.EnumCodeGenerator.NodeJs,
    project: {
      connect: {
        id: projectId,
      },
    },
  };
}

export function preparePluginRepositoryObject(
  projectId: string
): models.ResourceCreateInput {
  return {
    name: "Plugin Repository",
    description: "",
    resourceType: models.EnumResourceType.PluginRepository,
    codeGenerator: models.EnumCodeGenerator.NodeJs,
    project: {
      connect: {
        id: projectId,
      },
    },
  };
}

export function prepareComponentObject(
  projectId: string,
  blueprint: models.Blueprint
): models.ResourceCreateInput {
  return {
    name: `${blueprint.name}-name`,
    description: "",
    resourceType: models.EnumResourceType.Component,
    codeGenerator: null,
    blueprint: {
      connect: {
        id: blueprint.id,
      },
    },
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
    name: string;
  };
} = {
  [models.EnumResourceType.ProjectConfiguration]: {
    icon: "app-settings",
    color: "#f685a1",
    name: "Project",
  },
  [models.EnumResourceType.Service]: {
    icon: "code",
    color: "#A787FF",
    name: "Service",
  },
  [models.EnumResourceType.MessageBroker]: {
    icon: "queue",
    color: "#8DD9B9",
    name: "Message Broker",
  },
  [models.EnumResourceType.PluginRepository]: {
    icon: "plugin",
    color: "#53dbee",
    name: "Plugin Repository",
  },
  [models.EnumResourceType.ServiceTemplate]: {
    icon: "services",
    color: "#f6aa50",
    name: "Template",
  },
  [models.EnumResourceType.Component]: {
    icon: "blueprint",
    color: "#20A4F3",
    name: "Component",
  },
};
