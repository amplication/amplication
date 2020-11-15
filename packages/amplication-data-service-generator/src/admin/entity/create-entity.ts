import { Entity } from "../../types";
import { Module } from "../../util/module";
import { DTOs } from "../../resource/create-dtos";
import { createEntityListModule } from "./create-entity-list";
import { createCreateEntityModule } from "./create-create-entity";

export function createEntityModules(
  entity: Entity,
  dtos: DTOs
): Promise<Module[]> {
  return Promise.all([
    createEntityListModule(entity, dtos),
    createCreateEntityModule(entity, dtos),
  ]);
}
