import {
  PrismaDataSource,
  PrismaClientGenerator,
} from "@amplication/code-gen-types";

export const CLIENT_GENERATOR: PrismaClientGenerator = {
  name: "client",
  provider: "prisma-client-js",
  output: null,
  binaryTargets: [],
};

export const DATA_SOURCE: PrismaDataSource = {
  name: "postgres",
  provider: "PostgreSQL",
  urlEnv: "POSTGRESQL_URL",
};
