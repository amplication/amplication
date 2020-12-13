import { DTOs } from "../../server/resource/create-dtos";
import { Entity } from "../../types";
import { EntityComponent } from "../types";
import { createEntityTitleComponent } from "./entity-title-component/create-entity-title-component";

export async function createEntityTitleComponents(
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
          const titleComponent = await createEntityTitleComponent(
            entity,
            dtos,
            entityToDirectory,
            entityToResource,
            dtoNameToPath
          );
          return [entity.name, titleComponent];
        }
      )
    )
  );
}
