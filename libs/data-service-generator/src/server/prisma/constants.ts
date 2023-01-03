import {
  Generator,
  DataSourceProvider,
  DataSource,
  DataSourceURLEnv,
} from "prisma-schema-dsl-types";

export const CLIENT_GENERATOR: Generator = {
  name: "client",
  provider: "prisma-client-js",
};

export const DATA_SOURCE: DataSource = {
  name: "postgres",
  provider: DataSourceProvider.PostgreSQL,
  url: new DataSourceURLEnv("DB_URL"),
};
