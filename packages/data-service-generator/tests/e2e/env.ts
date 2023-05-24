import base64 from "base-64";

const APP_USERNAME = "admin";
const APP_PASSWORD = "admin";

export default {
  DB_USER: "admin",
  DB_NAME: "admin",
  DB_PASSWORD: "admin",
  APP_USERNAME,
  APP_PASSWORD,
  APP_DEFAULT_USER_ROLES: ["user"],
  APP_BASIC_AUTHORIZATION: `Basic ${base64.encode(
    APP_USERNAME + ":" + APP_PASSWORD
  )}`,
};
