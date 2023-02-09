import {
  CreateMessageBrokerNestJSModuleParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../../plugin-wrapper";

export function createMessageBrokerModule(
  eventParams: CreateMessageBrokerNestJSModuleParams
): Promise<Module[]> {
  return pluginWrapper(
    () => [],
    EventNames.CreateMessageBrokerNestJSModule,
    eventParams
  );
}
