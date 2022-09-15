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
    createMessageBrokerModuleInternal,
    EventNames.CreateMessageBrokerNestJSModule,
    eventParams
  );
}

export async function createMessageBrokerModuleInternal(
  eventParams: CreateMessageBrokerNestJSModuleParams["before"]
): Promise<Module[]> {
  return [];
}
