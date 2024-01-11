import DsgContext from "../../../dsg-context";
import pluginWrapper from "../../../plugin-wrapper";
import {
  CreateMessageBrokerNestJSModuleParams,
  EventNames,
  ModuleMap,
} from "@amplication/code-gen-types";

export function createMessageBrokerModule(
  eventParams: CreateMessageBrokerNestJSModuleParams
): Promise<ModuleMap> {
  return pluginWrapper(
    () => new ModuleMap(DsgContext.getInstance.logger),
    EventNames.CreateMessageBrokerNestJSModule,
    eventParams
  );
}
