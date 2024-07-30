import {
  CreateMessageBrokerNestJSModuleParams,
  EventNames,
  ModuleMap,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../../plugin-wrapper";
import DsgContext from "../../../dsg-context";

export function createMessageBrokerModule(
  eventParams: CreateMessageBrokerNestJSModuleParams
): Promise<ModuleMap> {
  return pluginWrapper(
    () => new ModuleMap(DsgContext.getInstance.logger),
    EventNames.CreateMessageBrokerNestJSModule,
    eventParams
  );
}
