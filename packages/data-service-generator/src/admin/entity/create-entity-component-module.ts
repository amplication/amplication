import { EntityComponent, Module } from "@amplication/code-gen-types";
import {
  print,
  removeTSIgnoreComments,
  removeTSInterfaceDeclares,
  removeTSVariableDeclares,
} from "@amplication/code-gen-utils";

export async function createEntityComponentModule(
  component: EntityComponent
): Promise<Module> {
  removeTSVariableDeclares(component.file);
  removeTSInterfaceDeclares(component.file);
  removeTSIgnoreComments(component.file);
  return {
    path: component.modulePath,
    code: print(component.file).code,
  };
}
