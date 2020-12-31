import { Entity, Module } from "../../types";
import { BASE_DIRECTORY } from "../constants";
import { createPrismaSchema } from "./create-prisma-schema";

const MODULE_PATH = `${BASE_DIRECTORY}/prisma/schema.prisma`;

export async function createPrismaSchemaModule(
  entities: Entity[]
): Promise<Module> {
  return {
    path: MODULE_PATH,
    code: await createPrismaSchema(entities),
  };
}
