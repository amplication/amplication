import { Module } from "../util/module";
import { EntityWithFields } from "../types";
import { createPrismaSchema } from "./create-prisma-schema";

export async function createPrismaSchemaModule(
  entities: EntityWithFields[]
): Promise<Module> {
  return {
    path: "schema.prisma",
    code: await createPrismaSchema(entities),
  };
}
