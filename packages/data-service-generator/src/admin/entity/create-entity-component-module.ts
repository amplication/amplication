import { print } from "@amplication/code-gen-utils";
import {
  removeTSIgnoreComments,
  removeTSInterfaceDeclares,
  removeTSVariableDeclares,
} from "../../utils/ast";
import { Module } from "@amplication/code-gen-types";
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
