import { Entity } from "../../types";
import { DTOs } from "../../resource/create-dtos";
import { EntityComponents } from "../types";
import { createNewEntityComponent } from "./new-entity-component/create-new-entity-component";
import { createEntityListComponent } from "./entity-list-component/create-entity-list-component";
import { createEntityComponent } from "./entity-component/create-entity-component";

export async function createEntityComponents(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  dtoNameToPath: Record<string, string>
): Promise<EntityComponents> {
  const [create, list, update] = await Promise.all([
    createNewEntityComponent(entity, dtos, entityToDirectory, dtoNameToPath),
    createEntityListComponent(entity, dtos, entityToDirectory, dtoNameToPath),
    createEntityComponent(entity, dtos, entityToDirectory, dtoNameToPath),
  ]);
  return { create, list, update };
}
