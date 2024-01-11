import { createEntityTitleComponent } from "./entity-title-component/create-entity-title-component";
import { Entity, EntityComponent } from "@amplication/code-gen-types";

export async function createEntityTitleComponents(
  entities: Entity[],
  entityToDirectory: Record<string, string>,
  entityToResource: Record<string, string>,
  dtoNameToPath: Record<string, string>
): Promise<Record<string, EntityComponent>> {
  return Object.fromEntries(
    await Promise.all(
      entities.map(async (entity): Promise<[string, EntityComponent]> => {
        const titleComponent = await createEntityTitleComponent(
          entity,
          entityToDirectory,
          entityToResource,
          dtoNameToPath
        );
        return [entity.name, titleComponent];
      })
    )
  );
}
