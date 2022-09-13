import { Entity, EventNames, Module } from "@amplication/code-gen-types";
import pluginWrapper from "../../plugin-wrapper";
import DsgContext from "../../dsg-context";
import { CLIENT_GENERATOR, DATA_SOURCE } from "./constants";
import { createPrismaSchema } from "./create-prisma-schema";

export async function createPrismaSchemaModule(
  entities: Entity[]
): Promise<Module[]> {
  const { serverDirectories } = DsgContext.getInstance;

  const MODULE_PATH = `${serverDirectories.baseDirectory}/prisma/schema.prisma`;
  return await pluginWrapper(
    createPrismaSchema,
    EventNames.CreatePrismaSchemaService,
    { entities, DATA_SOURCE, CLIENT_GENERATOR, MODULE_PATH }
  );
}
