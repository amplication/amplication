import { Entity, Module } from "@amplication/code-gen-types";
import { CLIENT_GENERATOR, DATA_SOURCE } from "./constants";
import { createPrismaSchema } from "./create-prisma-schema";

export async function createPrismaSchemaModule(
  entities: Entity[],
  baseDirectory: string
): Promise<Module> {
  const MODULE_PATH = `${baseDirectory}/prisma/schema.prisma`;
  return {
    path: MODULE_PATH,
    code: await createPrismaSchema(entities, DATA_SOURCE, CLIENT_GENERATOR),
  };
}
