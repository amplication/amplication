import { AuthProviderType } from "../models";
import { AppInfo } from "../types";

const appInfo: AppInfo = {
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
    appPassword: "admin",
    appUserName: "admin",
    authProvider: AuthProviderType.Http,
  },
};

export default appInfo;
