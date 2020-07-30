import { OpenAPIObject } from "openapi3-ts";
import {
  createPrismaSchema,
  Entity,
  PrismaDataSource,
} from "amplication-prisma-generator";
import { createDataService, Module } from "amplication-data-service-generator";

export async function generate(
  entities: Entity[],
  api: OpenAPIObject,
  dataSource: PrismaDataSource
): Promise<Module[]> {
  const prismaSchema = createPrismaSchema(dataSource, entities);
  const modules = await createDataService(api);
  const schemaModule: Module = {
    path: "schema.prisma",
    code: prismaSchema,
  };
  return [...modules, schemaModule];
}
