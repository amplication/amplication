import { DTOs } from "../../server/resource/create-dtos";
import { Entity } from "../../types";
import { EntityComponent, EntityComponents } from "../types";
import { createEntityComponents } from "./create-entity-components";

export async function createEntitiesComponents(
  entities: Entity[],
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  entityToTitleComponent: Record<string, EntityComponent>
): Promise<Record<string, EntityComponents>> {
  return Object.fromEntries(
    await Promise.all(
      entities.map(
        async (entity): Promise<[string, EntityComponents]> => {
          const components = await createEntityComponents(
            entity,
            dtos,
            entityToDirectory,
            entityToTitleComponent,
            entities
          );
          return [entity.name, components];
        }
      )
    )
  );
}
