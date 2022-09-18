import {
  CreateMessageBrokerNestJSModuleParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../../plugin-wrapper";

export function createMessageBrokerModule(
  eventParams: CreateMessageBrokerNestJSModuleParams["before"]
): Promise<Module[]> {
  return pluginWrapper(
    () => [],
    EventNames.CreateMessageBrokerNestJSModule,
    eventParams
  );
}
