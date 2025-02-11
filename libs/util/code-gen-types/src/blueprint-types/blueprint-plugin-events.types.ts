import {
  CreateBlueprintParams,
  CreateModulesParams,
  CreateModuleParams,
} from "./blueprint-plugin-events-params.types";
import {
  BlueprintEventNames,
  PluginEventType,
} from "./blueprint-plugins.types";

export type BlueprintEvents = {
  [BlueprintEventNames.createBlueprint]?: PluginEventType<CreateBlueprintParams>;
  [BlueprintEventNames.createModules]?: PluginEventType<CreateModulesParams>;
  [BlueprintEventNames.createModule]?: PluginEventType<CreateModuleParams>;
};
