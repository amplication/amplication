import { VariableDictionary } from "@amplication/code-gen-types";

export const SERVER_BASE_DIRECTORY = "server";
export const SRC_DIRECTORY = `${SERVER_BASE_DIRECTORY}/src`;
export const SCRIPTS_DIRECTORY = `${SERVER_BASE_DIRECTORY}/scripts`;

export const ENV_VARIABLES: VariableDictionary = [
  { BCRYPT_SALT: "10" },
  { COMPOSE_PROJECT_NAME: "amp_${resourceId}" },
  { PORT: "3000" },
];

export const DOCKER_COMPOSE_FILE_NAME = "docker-compose.template.yml";
export const DOCKER_COMPOSE_DB_FILE_NAME = "docker-compose.db.template.yml";
