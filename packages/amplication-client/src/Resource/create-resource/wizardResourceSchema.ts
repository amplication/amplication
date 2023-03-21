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
  },
  required: ["gitOrganizationId", "gitRepositoryName"],
};

const codeGeneration = {
  properties: {
    isGenerateCompleted: {
      type: "string",
      minLength: 2,
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
      minLength: 4,
    },
  },
  required: ["baseDir", "structureType"],
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
    activePages: [0],
  },
  {
    title: "General Settings",
    activePages: [1, 2, 3],
  },
  {
    title: "DB Settings",
    activePages: [4, 5],
  },
  {
    title: "Auth Settings",
    activePages: [6],
  },
  {
    title: "Generate Code",
    activePages: [7],
  },
  {
    title: "Confirmation & Next Steps",
    activePages: [8],
  },
];
