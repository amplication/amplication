import { Entity, Module } from "../../types";
import { createPrismaSchema } from "./create-prisma-schema";

export async function createPrismaSchemaModule(
  entities: Entity[],
  entityIdToName: Record<string, string>
): Promise<Module> {
  return {
    path: "prisma/schema.prisma",
    code: await createPrismaSchema(entities, entityIdToName),
  };
}
