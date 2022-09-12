import { VariableDictionary } from "@amplication/code-gen-types";

export const BASE_DIRECTORY = "server";
export const SRC_DIRECTORY = `${BASE_DIRECTORY}/src`;
export const SCRIPTS_DIRECTORY = `${BASE_DIRECTORY}/scripts`;
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

export const MYSQL_DOCKER_COMPOSE_DB_IMAGE = {
  version: "3.1",
  services: {
    db: {
      image: "mysql",
      ports: ["3306:3306"],
      environment: {
        MYSQL_ROOT_PASSWORD: "example",
        MYSQL_USER: "root",
      },
    },
  },
  volumes: { mysql: null },
};

export const DOCKER_COMPOSE_FILE_NAME = "docker-compose.yml";
export const DOCKER_COMPOSE_DB_FILE_NAME = "docker-compose.db.yml";
