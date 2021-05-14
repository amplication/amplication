import { Module } from "../../types";
import { EntityComponents, EntityComponent } from "../types";
import { createEntityComponentModule } from "./create-entity-component-module";

export function createEntityComponentsModules(
  components: Record<string, EntityComponents>
): Promise<Module[]> {
  return Promise.all(
    Object.values(components).flatMap((entityComponents) =>
      Object.values(entityComponents).flatMap((component) =>
        createEntityComponentModule(component)
      )
    )
  );
}

export function createEntityTitleComponentsModules(
  titleComponents: Record<string, EntityComponent>
): Promise<Module[]> {
  return Promise.all(
    Object.values(titleComponents).flatMap((component) =>
      createEntityComponentModule(component)
    )
  );
}
