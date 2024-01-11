import { CLIENT_GENERATOR, DATA_SOURCE } from "./constants";
import { createPrismaSchema } from "./create-prisma-schema";
import { createPrismaSchemaFieldsHandlers } from "./create-prisma-schema-fields";
import { Entity, ModuleMap } from "@amplication/code-gen-types";

export async function createPrismaSchemaModule(
  entities: Entity[]
): Promise<ModuleMap> {
  return await createPrismaSchema({
    entities,
    dataSource: DATA_SOURCE,
    clientGenerator: CLIENT_GENERATOR,
    createFieldsHandlers: createPrismaSchemaFieldsHandlers,
  });
}
