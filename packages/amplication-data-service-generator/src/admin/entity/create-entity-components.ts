import { Entity } from "../../types";
import { DTOs } from "../../server/resource/create-dtos";
import { EntityComponents } from "../types";
import { createNewEntityComponent } from "./new-entity-component/create-new-entity-component";
import { createEntityListComponent } from "./entity-list-component/create-entity-list-component";
import { createEntityComponent } from "./entity-component/create-entity-component";

export async function createEntityComponents(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  dtoNameToPath: Record<string, string>,
  entityIdToName: Record<string, string>
): Promise<EntityComponents> {
  const [list, newComponent, entityComponent] = await Promise.all([
    createEntityListComponent(entity, dtos, entityToDirectory, dtoNameToPath),
    createNewEntityComponent(
      entity,
      dtos,
      entityToDirectory,
      dtoNameToPath,
      entityIdToName
    ),
    createEntityComponent(
      entity,
      dtos,
      entityToDirectory,
      dtoNameToPath,
      entityIdToName
    ),
  ]);
  return { list, new: newComponent, entity: entityComponent };
}
