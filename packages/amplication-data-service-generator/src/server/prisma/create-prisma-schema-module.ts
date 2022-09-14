import { Entity, Module } from "@amplication/code-gen-types";
import DsgContext from "../../dsg-context";
import { CLIENT_GENERATOR, DATA_SOURCE } from "./constants";
import { createPrismaSchema } from "./create-prisma-schema";

export async function createPrismaSchemaModule(
  entities: Entity[]
): Promise<Module> {
  const { serverDirectories } = DsgContext.getInstance;
  const MODULE_PATH = `${serverDirectories.baseDirectory}/prisma/schema.prisma`;
  return {
    path: MODULE_PATH,
    code: await createPrismaSchema(entities, DATA_SOURCE, CLIENT_GENERATOR),
  };
}
