import { DTOs } from "../../resource/create-dtos";
import { Entity } from "../../types";
import { EntityComponents } from "../types";
import { createEntityComponents } from "./create-entity-components";

export async function createEntitiesComponents(
  entities: Entity[],
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  dtoNameToPath: Record<string, string>
): Promise<Record<string, EntityComponents>> {
  return Object.fromEntries(
    await Promise.all(
      entities.map(
        async (entity): Promise<[string, EntityComponents]> => {
          const components = await createEntityComponents(
            entity,
            dtos,
            entityToDirectory,
            dtoNameToPath
          );
          return [entity.name, components];
        }
      )
    )
  );
}
