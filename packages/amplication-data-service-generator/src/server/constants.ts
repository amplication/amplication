import { VariableDictionary } from "@amplication/code-gen-types";

export const SERVER_BASE_DIRECTORY = "server";
export const SRC_DIRECTORY = `${SERVER_BASE_DIRECTORY}/src`;
export const SCRIPTS_DIRECTORY = `${SERVER_BASE_DIRECTORY}/scripts`;
export const AUTH_PATH = `${SRC_DIRECTORY}/auth`;

export const ENV_VARIABLES: VariableDictionary = [
  { POSTGRESQL_USER: "${dbUser}" },
  { POSTGRESQL_PASSWORD: "${dbPassword}" },
  { POSTGRESQL_PORT: "${dbPort}" },
  {
    POSTGRESQL_URL:
      "postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}${dbName}",
  },
  { BCRYPT_SALT: "10" },
  { COMPOSE_PROJECT_NAME: "amp_${resourceId}" },
  { JWT_SECRET_KEY: "Change_ME!!!" },
  { JWT_EXPIRATION: "2d" },
  { SERVER_PORT: "3000" },
];
