import * as PrismaSchemaDSL from "prisma-schema-dsl";

export type PrismaDataSource = {
  name: string;
  provider: PrismaSchemaDSL.DataSourceProvider;
  url: PrismaSchemaDSL.DataSourceURLEnv;
};

export const CLIENT_GENERATOR: PrismaSchemaDSL.Generator = PrismaSchemaDSL.createGenerator(
  "client",
  "prisma-client-js"
);

export const DATA_SOURCE: PrismaDataSource = {
  name: "postgres",
  provider: PrismaSchemaDSL.DataSourceProvider.PostgreSQL,
  url: new PrismaSchemaDSL.DataSourceURLEnv("POSTGRESQL_URL"),
};
