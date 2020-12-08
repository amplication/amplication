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

export function createEntitySelectComponentsModules(
  selectComponents: Record<string, EntityComponent>
): Promise<Module[]> {
  return Promise.all(
    Object.values(selectComponents).flatMap((component) =>
      createEntityComponentModule(component)
    )
  );
}
