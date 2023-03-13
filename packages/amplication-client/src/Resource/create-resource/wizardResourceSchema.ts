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
    },
    gitRepositoryName: {
      type: "string",
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
      enum: ["monorepo", "polyrepo"],
    },
    baseDir: {
      type: "string",
      minLength: 4,
    },
  },
  required: ["structureType"],
};

const DataBaseType = {
  properties: {
    dataBaseType: {
      enum: ["postgres", "mongo", "mysql"],
    },
  },
  required: ["dataBaseType"],
};

const Auth = {
  properties: {
    authSwitch: {
      type: "boolean",
    },
  },
  required: ["authSwitch"],
};

export const schemaArray = [
  [],
  ResourceName,
  GitRepository,
  GenerationSettings,
  StructureType,
  DataBaseType,
  Auth,
  [],
  [],
];

export const ResourceInitialValues = {
  serviceName: null,
  gitOrganizationId: null,
  gitRepositoryName: null,
  generateAdminUI: false,
  generateGraphQL: false,
  generateRestApi: false,
  structureType: "monorepo",
  dataBaseType: "postgres",
  authSwitch: false,
};
