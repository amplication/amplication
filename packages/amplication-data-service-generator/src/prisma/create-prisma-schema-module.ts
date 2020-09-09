import { Module } from "../util/module";
import { FullEntity } from "../types";
import { createPrismaSchema } from "./create-prisma-schema";

export async function createPrismaSchemaModule(
  entities: FullEntity[]
): Promise<Module> {
  return {
    path: "schema.prisma",
    code: await createPrismaSchema(entities),
  };
}
