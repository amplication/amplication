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
    },
  },
  required: ["structureType"],
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
  [],
  ResourceName,
  GitRepository,
  GenerationSettings,
  StructureType,
  DatabaseType,
  Auth,
  [],
  [],
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
  baseDir: "",
  databaseType: "postgres",
  resourceType: "scratch",
  authType: "no",
};

export interface WizardProgressBarInterface {
  title?: string;
  activePages?: number[];
}

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
    activePages: [5],
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
