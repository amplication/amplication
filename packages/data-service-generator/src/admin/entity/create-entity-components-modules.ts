import { ModuleMap } from "@amplication/code-gen-types";
import { EntityComponent, EntityComponents } from "../types";
import { createEntityComponentModule } from "./create-entity-component-module";

export const createEntityComponentsModules = async (
  components: Record<string, EntityComponents>
): Promise<ModuleMap> => {
  const entityComponentsModules = new ModuleMap();
  const entityComponents = Object.values(components).flatMap(
    (entityComponents) => Object.values(entityComponents)
  );

  for await (const entityComponent of entityComponents) {
    const module = await createEntityComponentModule(entityComponent);
    entityComponentsModules.set(module.path, module);
  }

  return entityComponentsModules;
};

export const createEntityTitleComponentsModules = async (
  titleComponents: Record<string, EntityComponent>
): Promise<ModuleMap> => {
  const entityTitleComponentsModules = new ModuleMap();
  for await (const component of Object.values(titleComponents)) {
    const module = await createEntityComponentModule(component);
    entityTitleComponentsModules.set(module.path, module);
  }

  return entityTitleComponentsModules;
};
