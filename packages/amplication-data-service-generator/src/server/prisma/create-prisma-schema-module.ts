import { Entity, Module } from "@amplication/code-gen-types";
import DsgContext from "../../dsg-context";
import { CLIENT_GENERATOR, DATA_SOURCE } from "./constants";
import { createPrismaSchema } from "./create-prisma-schema";

export async function createPrismaSchemaModule(
  entities: Entity[]
): Promise<Module[]> {
  return await createPrismaSchema({
    entities,
    dataSource: DATA_SOURCE,
    clientGenerator: CLIENT_GENERATOR,
  });
}
