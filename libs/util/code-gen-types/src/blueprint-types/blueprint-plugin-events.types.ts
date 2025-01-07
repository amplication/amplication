import { CreateBlueprintParams } from "./blueprint-plugin-events-params.types";
import {
  BlueprintEventNames,
  PluginEventType,
} from "./blueprint-plugins.types";

export type BlueprintEvents = {
  [BlueprintEventNames.createBlueprint]?: PluginEventType<CreateBlueprintParams>;
};
