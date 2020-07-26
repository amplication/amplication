import { OpenAPIObject } from "openapi3-ts";
import {
  createPrismaSchema,
  Entity,
  PrismaDataSource,
} from "amplication-prisma-generator";
import { createApp, Module } from "amplication-server-generator";

export async function generate(
  entities: Entity[],
  api: OpenAPIObject,
  dataSource: PrismaDataSource
): Promise<Module[]> {
  const prismaSchema = createPrismaSchema(dataSource, entities);
  const modules = await createApp(api);
  const schemaModule: Module = {
    path: "schema.prisma",
    code: prismaSchema,
  };
  return [...modules, schemaModule];
}
