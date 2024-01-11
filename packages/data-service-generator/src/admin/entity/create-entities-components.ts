import { createEntityComponents } from "./create-entity-components";
import {
  Entity,
  EntityComponent,
  EntityComponents,
} from "@amplication/code-gen-types";

export async function createEntitiesComponents(
  entities: Entity[],
  entityToDirectory: Record<string, string>,
  entityToTitleComponent: Record<string, EntityComponent>,
  entityNameToEntity: Record<string, Entity>
): Promise<Record<string, EntityComponents>> {
  return Object.fromEntries(
    await Promise.all(
      entities.map(async (entity): Promise<[string, EntityComponents]> => {
        const components = await createEntityComponents(
          entity,
          entityToDirectory,
          entityToTitleComponent,
          entityNameToEntity
        );
        return [entity.name, components];
      })
    )
  );
}
