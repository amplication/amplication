import { EnumAuthProviderType } from "../models";
import { AppInfo } from "../types";

const appInfo: [string, AppInfo][] = [
  [
    "RegularApp",
    {
      name: "Sample Application",
      description: "Sample application for testing",
      version: "0.1.3",
      id: "ckl0ow1xj00763cjnch10k6mc",
      url: "https://app.amplication.com/ckl0ow1xj00763cjnch10k6mc",
      settings: {
        dbHost: "localhost",
        dbName: "db-name",
        dbPort: 5433,
        dbPassword: "1234",
        dbUser: "testUsername",
        authProvider: EnumAuthProviderType.Http,
        serverSettings: {
          generateGraphQL: true,
          generateRestApi: true,
          serverPath: "",
        },
        adminUISettings: {
          generateAdminUI: true,
          adminUIPath: "",
        },
      },
    },
  ],
  [
    "WithoutGraphQL",
    {
      name: "Sample Application",
      description: "Sample application for testing",
      version: "0.1.3",
      id: "ckl0ow1xj00763cjnch10k6mc",
      url: "https://app.amplication.com/ckl0ow1xj00763cjnch10k6mc",
      settings: {
        dbHost: "localhost",
        dbName: "db-name",
        dbPort: 5433,
        dbPassword: "1234",
        dbUser: "testUsername",
        authProvider: EnumAuthProviderType.Http,
        serverSettings: {
          generateGraphQL: false,
          generateRestApi: true,
          serverPath: "",
        },
        adminUISettings: {
          generateAdminUI: true,
          adminUIPath: "",
        },
      },
    },
  ],
  [
    "WithoutRestApi",
    {
      name: "Sample Application",
      description: "Sample application for testing",
      version: "0.1.3",
      id: "ckl0ow1xj00763cjnch10k6mc",
      url: "https://app.amplication.com/ckl0ow1xj00763cjnch10k6mc",
      settings: {
        dbHost: "localhost",
        dbName: "db-name",
        dbPort: 5433,
        dbPassword: "1234",
        dbUser: "testUsername",
        authProvider: EnumAuthProviderType.Http,
        serverSettings: {
          generateGraphQL: true,
          generateRestApi: false,
          serverPath: "",
        },
        adminUISettings: {
          generateAdminUI: true,
          adminUIPath: "",
        },
      },
    },
  ],
  [
    "WithCustomPath",
    {
      name: "Sample Application",
      description: "Sample application for testing",
      version: "0.1.3",
      id: "ckl0ow1xj00763cjnch10k6mc",
      url: "https://app.amplication.com/ckl0ow1xj00763cjnch10k6mc",
      settings: {
        dbHost: "localhost",
        dbName: "db-name",
        dbPort: 5433,
        dbPassword: "1234",
        dbUser: "testUsername",
        authProvider: EnumAuthProviderType.Http,
        serverSettings: {
          generateGraphQL: true,
          generateRestApi: true,
          serverPath: "test",
        },
        adminUISettings: {
          generateAdminUI: true,
          adminUIPath: "test-ui",
        },
      },
    },
  ],
];

export default appInfo;
