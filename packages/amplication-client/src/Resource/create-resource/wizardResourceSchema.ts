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
  Auth,
  {},
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
  structureType: "Mono",
  baseDir: "./apps",
  databaseType: "postgres",
  resourceType: "scratch",
  authType: "core",
};

export interface WizardProgressBarInterface {
  title?: string;
  activePages?: number[];
}

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
    activePages: [4],
  },
  {
    title: "Auth Settings",
    activePages: [5],
  },
  {
    title: "Generate Code",
    activePages: [6],
  },
  {
    title: "Confirmation & Next Steps",
    activePages: [7],
  },
];
