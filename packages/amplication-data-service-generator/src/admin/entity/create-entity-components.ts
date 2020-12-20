import { Entity } from "../../types";
import { DTOs } from "../../server/resource/create-dtos";
import { EntityComponent, EntityComponents } from "../types";
import { createNewEntityComponent } from "./new-entity-component/create-new-entity-component";
import { createEntityListComponent } from "./entity-list-component/create-entity-list-component";
import { createEntityComponent } from "./entity-component/create-entity-component";
import { createEntityIndexComponent } from "./entity-index-component/create-entity-index-component";

export async function createEntityComponents(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  entityToPath: Record<string, string>,
  entityToResource: Record<string, string>,
  dtoNameToPath: Record<string, string>,
  entityIdToName: Record<string, string>,
  entityToSelectComponent: Record<string, EntityComponent>,
  entityToTitleComponent: Record<string, EntityComponent>
): Promise<EntityComponents> {
  const [list, newComponent, entityComponent] = await Promise.all([
    createEntityListComponent(
      entity,
      dtos,
      entityToDirectory,
      entityToPath,
      entityToResource,
      dtoNameToPath,
      entityIdToName,
      entityToTitleComponent
    ),
    createNewEntityComponent(
      entity,
      dtos,
      entityToDirectory,
      entityToPath,
      entityToResource,
      dtoNameToPath,
      entityIdToName,
      entityToSelectComponent
    ),
    createEntityComponent(
      entity,
      dtos,
      entityToDirectory,
      entityToPath,
      entityToResource,
      dtoNameToPath,
      entityIdToName,
      entityToSelectComponent
    ),
  ]);
  const index = await createEntityIndexComponent(
    entity,
    entityToDirectory,
    entityToPath,
    list,
    newComponent,
    entityComponent
  );
  return { list, new: newComponent, entity: entityComponent, index };
}
