import { print } from "recast";
import {
  removeTSIgnoreComments,
  removeTSInterfaceDeclares,
  removeTSVariableDeclares,
} from "../../util/ast";
import { Module } from "../../types";
import { EntityComponent } from "../types";

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
