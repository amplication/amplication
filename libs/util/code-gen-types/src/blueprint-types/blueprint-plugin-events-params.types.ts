import { EventParams } from "./blueprint-plugins.types";
import {
  ModuleActionsAndDtosMap,
  ModuleActionsAndDtos,
} from "../code-gen-types";

export interface CreateBlueprintParams extends EventParams {}
export interface CreateModulesParams extends EventParams {
  moduleActionsAndDtoMap: ModuleActionsAndDtosMap;
}
export interface CreateModuleParams extends EventParams {
  moduleName: string;
  moduleActionsAndDto: ModuleActionsAndDtos;
}
