import { Entity } from "@amplication/code-gen-types";
import { EntityComponent, EntityComponents } from "../types";
import { createEntityCreateComponent } from "./entity-create-component/create-entity-create-component";
import { createEntityListComponent } from "./entity-list-component/create-entity-list-component";
import { createEditEntityComponent } from "./entity-edit-component/create-edit-entity-component";
import { createEntityShowComponent } from "./entity-show-component/create-entity-show-component";

export async function createEntityComponents(
  entity: Entity,
  entityToDirectory: Record<string, string>,
  entityToTitleComponent: Record<string, EntityComponent>,
  entityNameToEntity: Record<string, Entity>
): Promise<EntityComponents> {
  const [list, newComponent, editComponent, showComponent] = await Promise.all([
    createEntityListComponent(
      entity,
      entityToDirectory,
      entityToTitleComponent
    ),
    createEntityCreateComponent(
      entity,
      entityToDirectory,
      entityToTitleComponent
    ),
    createEditEntityComponent(
      entity,
      entityToDirectory,
      entityToTitleComponent
    ),
    createEntityShowComponent(
      entity,
      entityToDirectory,
      entityToTitleComponent,
      entityNameToEntity
    ),
  ]);

  return { list, new: newComponent, edit: editComponent, show: showComponent };
}
