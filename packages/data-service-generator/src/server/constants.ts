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
export const DOCKER_COMPOSE_DEV_FILE_NAME = "docker-compose.dev.template.yml";
export const GRAPHQL_BIGINT_FILE_NAME = "GraphQLBigInt.template.ts";
export const BIGINT_FILTER_FILE_NAME = "BigIntFilter.template.ts";
export const BIGINT_NULLABLE_FILTER_FILE_NAME =
  "BigIntNullableFilter.template.ts";
export const DECIMAL_FILTER_FILE_NAME = "DecimalFilter.template.ts";
export const DECIMAL_NULLABLE_FILTER_FILE_NAME =
  "DecimalNullableFilter.template.ts";
export const MAIN_TS_FILE_NAME = "main.template.ts";
export const MAIN_TS_WITH_BIGINT_FILE_NAME = "main.with-bigint.template.ts";
