import { Entity } from "../../types";
import { Module } from "../../util/module";
import { createEntityListModule } from "./create-entity-list";
import { createCreateEntityModule } from "./create-create-entity";

export function createEntityModules(entity: Entity): Promise<Module[]> {
  return Promise.all([
    createEntityListModule(entity),
    createCreateEntityModule(entity),
  ]);
}
