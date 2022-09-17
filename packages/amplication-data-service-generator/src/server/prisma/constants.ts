import { PrismaDataSource, PrismaClientGenerator } from "@amplication/code-gen-types";
import * as PrismaSchemaDSL from "prisma-schema-dsl";

export const CLIENT_GENERATOR: PrismaClientGenerator = PrismaSchemaDSL.createGenerator(
  "client",
  "prisma-client-js"
);

export const DATA_SOURCE: PrismaDataSource = {
  name: "postgres",
  provider: "PostgreSQL",
  urlEnv: "POSTGRESQL_URL",
};
