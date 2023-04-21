import {
  CreateMessageBrokerNestJSModuleParams,
  EventNames,
  ModuleMap,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../../plugin-wrapper";

export function createMessageBrokerModule(
  eventParams: CreateMessageBrokerNestJSModuleParams
): Promise<ModuleMap> {
  return pluginWrapper(
    () => new ModuleMap(),
    EventNames.CreateMessageBrokerNestJSModule,
    eventParams
  );
}
