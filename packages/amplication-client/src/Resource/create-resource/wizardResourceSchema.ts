import { sampleServiceResourceWithEntities } from "../constants";
import { EnumTemplateType } from "./wizard-pages/interfaces";

const ResourceName = {
  properties: {
    serviceName: {
      type: "string",
      minLength: 2,
    },
  },
  required: ["serviceName"],
};

const GitRepository = {
  anyOf: [
    {
      properties: {
        gitOrganizationId: {
          type: "string",
          minLength: 2,
        },
        gitRepositoryName: {
          type: "string",
          minLength: 2,
        },
        gitRepositoryUrl: {
          type: "string",
          minLength: 2,
        },
        isOverrideGitRepository: {
          type: "boolean",
          default: false,
        },
      },
      required: ["gitOrganizationId", "gitRepositoryName"],
    },
    {
      properties: {
        connectToDemoRepo: { const: true },
      },
    },
  ],
};

const codeGeneration = {
  properties: {
    isGenerateCompleted: {
      type: "string",
    },
  },
  required: ["isGenerateCompleted"],
};

const GenerationSettings = {
  properties: {
    generateAdminUI: {
      type: "boolean",
      default: false,
    },
    generateGraphQL: {
      type: "boolean",
      default: false,
    },
    generateRestApi: {
      type: "boolean",
      default: false,
    },
  },
  required: ["generateAdminUI", "generateGraphQL", "generateRestApi"],
};

const StructureType = {
  properties: {
    structureType: {
      enum: ["Mono", "Poly"],
    },
    baseDir: {
      type: "string",
    },
  },
  anyOf: [
    {
      properties: {
        structureType: { const: "Mono" },
        baseDir: {
          minLength: 4,
        },
      },
    },
    {
      properties: {
        structureType: { const: "Poly" },
        baseDir: {
          minLength: 0,
        },
      },
    },
  ],
};

const DatabaseType = {
  properties: {
    databaseType: {
      enum: ["postgres", "mongo", "mysql"],
    },
  },
  required: ["databaseType"],
};

const TemplateType = {
  properties: {
    templateType: {
      enum: ["empty", "orderManagement"],
    },
  },
  required: ["templateType"],
};

const Auth = {
  properties: {
    authType: {
      enum: ["core", "no"],
    },
  },
  required: ["authType"],
};

export const schemaArray = [
  {},
  ResourceName,
  GitRepository,
  GenerationSettings,
  StructureType,
  DatabaseType,
  TemplateType,
  Auth,
  codeGeneration,
  {},
];

export const ResourceInitialValues = {
  serviceName: null,
  gitOrganizationId: null,
  gitRepositoryName: null,
  isOverrideGitRepository: false,
  gitRepositoryUrl: null,
  generateAdminUI: true,
  generateGraphQL: true,
  generateRestApi: true,
  isGenerateCompleted: null,
  structureType: "Mono",
  baseDir: "./apps",
  databaseType: "postgres",
  templateType: "empty",
  authType: "core",
  gitProvider: null,
  connectToDemoRepo: false,
};

export interface WizardProgressBarInterface {
  title?: string;
  activePages?: number[];
}

export interface TemplateSettings {
  type: EnumTemplateType;
  description: string;
  eventName: string;
  entities: any;
}

export const templateMapping: { [key: string]: TemplateSettings } = {
  [EnumTemplateType.empty]: {
    type: EnumTemplateType.empty,
    description: "",
    eventName: "createResourceFromScratch",
    entities: [],
  },
  [EnumTemplateType.orderManagement]: {
    type: EnumTemplateType.orderManagement,
    description: "Sample service for e-commerce",
    eventName: "createResourceFromSample",
    entities: sampleServiceResourceWithEntities,
  },
};

export const wizardProgressBarSchema = [
  {
    title: "create service",
    activePages: [1],
  },
  {
    title: "General Settings",
    activePages: [2, 3, 4],
  },
  {
    title: "DB Settings",
    activePages: [5, 6],
  },
  {
    title: "Auth Settings",
    activePages: [7],
  },
  {
    title: "Generate Code",
    activePages: [8],
  },
  {
    title: "Finish",
    activePages: [9],
  },
];
