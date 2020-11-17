import { Entity } from "../../types";
import { Module } from "../../util/module";
import { DTOs } from "../../resource/create-dtos";
import { createEntityListModule } from "./create-entity-list";
import { createCreateEntityModule } from "./create-create-entity";
import { createUpdateEntityModule } from "./create-update-entity";

export function createEntityModules(
  entity: Entity,
  entityToDirectory: Record<string, string>,
  dtos: DTOs,
  dtoNameToPath: Record<string, string>
): Promise<Module[]> {
  return Promise.all([
    createEntityListModule(entity, entityToDirectory, dtos),
    createCreateEntityModule(entity, entityToDirectory, dtos),
    createUpdateEntityModule(entity, entityToDirectory, dtos, dtoNameToPath),
  ]);
}
