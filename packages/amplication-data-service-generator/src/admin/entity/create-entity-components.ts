import { Entity } from "../../types";
import { DTOs } from "../../resource/create-dtos";
import { EntityComponents } from "../types";
import { createCreateEntityComponent } from "./create/create-create-entity";
import { createEntityListComponent } from "./list/create-entity-list";
import { createUpdateEntityComponent } from "./update/create-update-entity";

export async function createEntityComponents(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  dtoNameToPath: Record<string, string>
): Promise<EntityComponents> {
  const [create, list, update] = await Promise.all([
    createCreateEntityComponent(entity, dtos, entityToDirectory, dtoNameToPath),
    createEntityListComponent(entity, dtos, entityToDirectory, dtoNameToPath),
    createUpdateEntityComponent(entity, dtos, entityToDirectory, dtoNameToPath),
  ]);
  return { create, list, update };
}
