import { Module } from "../../util/module";
import { EntityComponents } from "../types";
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
