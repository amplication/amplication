import { Module } from "../util/module";
import { Entity } from "../models";
import { createPrismaSchema } from "./create-prisma-schema";

export async function createPrismaSchemaModule(
  entities: Entity[]
): Promise<Module> {
  return {
    path: "schema.prisma",
    code: await createPrismaSchema(entities),
  };
}
