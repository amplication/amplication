import { Entity, ModuleMap } from "@amplication/code-gen-types";
import { CLIENT_GENERATOR, DATA_SOURCE } from "./constants";
import { createPrismaSchema } from "./create-prisma-schema";
import { createPrismaSchemaFieldsHandlers } from "./create-prisma-schema-fields";

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
