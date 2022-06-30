const FORM_SCHEMA = {
  properties: {
    dbHost: {
      type: "string",
      minLength: 2,
    },
    dbUser: {
      type: "string",
      minLength: 2,
    },
    dbPassword: {
      type: "string",
      minLength: 2,
    },
    dbPort: {
      type: "integer",
      minLength: 4,
      maxLength: 5,
    },
    dbName: {
      type: "string",
    },
    serverSettings: {
      properties: {
        generateGraphQL: {
          type: "boolean",
        },
        generateRestApi: {
          type: "boolean",
        },
        serverPath: {
          type: "string",
        },
      },
      required: ["generateGraphQL", "generateRestApi"],
    },
    adminUISettings: {
      properties: {
        generateAdminUI: {
          type: "boolean",
        },
        adminUIPath: {
          type: "string",
        },
      },
      required: ["generateAdminUI"],
    },
  },
  required: [
    "dbHost",
    "dbUser",
    "dbPassword",
    "dbPort",
    "serverSettings",
    "adminUISettings",
  ],
};

export default FORM_SCHEMA;
