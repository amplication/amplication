import { PrismaDataSource } from "@amplication/code-gen-types";
import * as PrismaSchemaDSL from "prisma-schema-dsl";

export const CLIENT_GENERATOR: PrismaSchemaDSL.Generator = PrismaSchemaDSL.createGenerator(
  "client",
  "prisma-client-js"
);

export const DATA_SOURCE: PrismaDataSource = {
  name: "postgres",
  provider: "PostgreSQL",
  urlEnv: "POSTGRESQL_URL",
};
