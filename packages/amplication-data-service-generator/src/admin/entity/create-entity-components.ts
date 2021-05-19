import { Entity } from "../../types";
import { DTOs } from "../../server/resource/create-dtos";
import { EntityComponent, EntityComponents } from "../types";
import { createEntityCreateComponent } from "./entity-create-component/create-entity-create-component";
import { createEntityListComponent } from "./entity-list-component/create-entity-list-component";
import { createEditEntityComponent } from "./entity-edit-component/create-edit-entity-component";
import { createEntityShowComponent } from "./entity-show-component/create-entity-show-component";

export async function createEntityComponents(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  entityToTitleComponent: Record<string, EntityComponent>,
  entityNameToEntity: Record<string, Entity>
): Promise<EntityComponents> {
  const [list, newComponent, editComponent, showComponent] = await Promise.all([
    createEntityListComponent(
      entity,
      dtos,
      entityToDirectory,
      entityToTitleComponent
    ),
    createEntityCreateComponent(
      entity,
      dtos,
      entityToDirectory,
      entityToTitleComponent
    ),
    createEditEntityComponent(
      entity,
      dtos,
      entityToDirectory,
      entityToTitleComponent
    ),
    createEntityShowComponent(
      entity,
      dtos,
      entityToDirectory,
      entityToTitleComponent,
      entityNameToEntity
    ),
  ]);

  return { list, new: newComponent, edit: editComponent, show: showComponent };
}
