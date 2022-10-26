import { gql } from "@apollo/client";
import * as models from "../models";

export const serviceSettingsFieldsInitValues = {
  generateAdminUI: true,
  generateGraphQL: true,
  generateRestApi: true,
  resourceType: "scratch",
};

export const sampleServiceResourceWithoutEntities = (
  projectId: string,
  generateAdminUI: boolean,
  generateGraphQL: boolean,
  generateRestApi: boolean
): models.ResourceCreateWithEntitiesInput => ({
  resource: {
    name: "My service",
    description: "",
    resourceType: models.EnumResourceType.Service,
    project: {
      connect: {
        id: projectId,
      },
    },
  },
  commitMessage: "",
  entities: [],
  generationSettings: {
    generateAdminUI: generateAdminUI,
    generateGraphQL: generateGraphQL,
    generateRestApi: generateRestApi,
  },
});

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
  projectId: string,
  isResourceWithEntities: boolean,
  generateAdminUI: boolean,
  generateGraphQL: boolean,
  generateRestApi: boolean
): models.ResourceCreateWithEntitiesInput {
  return {
    resource: {
      name: isResourceWithEntities ? "Sample service" : "My service",
      description: isResourceWithEntities
        ? "Sample service for e-commerce"
        : "",
      resourceType: models.EnumResourceType.Service,
      project: {
        connect: {
          id: projectId,
        },
      },
    },
    commitMessage: "",
    generationSettings: {
      generateAdminUI: generateAdminUI,
      generateGraphQL: generateGraphQL,
      generateRestApi: generateRestApi,
    },
    entities: isResourceWithEntities ? sampleServiceResourceWithEntities : [],
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

export const GET_APP_SETTINGS = gql`
  query serviceSettings($id: String!) {
    serviceSettings(where: { id: $id }) {
      id
      dbHost
      dbName
      dbUser
      dbPassword
      dbPort
      authProvider
    }
  }
`;

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
