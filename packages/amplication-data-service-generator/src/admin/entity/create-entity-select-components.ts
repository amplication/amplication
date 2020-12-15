import { DTOs } from "../../server/resource/create-dtos";
import { Entity } from "../../types";
import { EntityComponent } from "../types";
import { createEntitySelectComponent } from "./entity-select-component/create-entity-select-component";

export async function createEntitySelectComponents(
  entities: Entity[],
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  entityToResource: Record<string, string>,
  dtoNameToPath: Record<string, string>
): Promise<Record<string, EntityComponent>> {
  return Object.fromEntries(
    await Promise.all(
      entities.map(
        async (entity): Promise<[string, EntityComponent]> => {
          const selectComponent = await createEntitySelectComponent(
            entity,
            dtos,
            entityToDirectory,
            entityToResource,
            dtoNameToPath
          );
          return [entity.name, selectComponent];
        }
      )
    )
  );
}
