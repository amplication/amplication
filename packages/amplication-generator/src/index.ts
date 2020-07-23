import { OpenAPIObject } from "openapi3-ts";
import {
  createPrismaSchema,
  Entity,
  PrismaDataSource,
  EnumPrismaDataSourceProvider,
} from "amplication-prisma-generator";
import { createApp, Module } from "amplication-server-generator";

export async function generate(
  entities: Entity[],
  api: OpenAPIObject
): Promise<Module[]> {
  /** @todo define external DB connection */
  const dataSource: PrismaDataSource = {
    name: "sqlite",
    provider: EnumPrismaDataSourceProvider.SQLite,
    url: "file:./dev.db",
  };
  const prismaSchema = createPrismaSchema(dataSource, entities);
  const modules = await createApp(api);
  const schemaModule: Module = {
    path: "schema.prisma",
    code: prismaSchema,
  };
  return [...modules, schemaModule];
}
