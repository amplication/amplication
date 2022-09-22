import {
  CreateMessageBrokerClientOptionsFactoryParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../../plugin-wrapper";

export async function createMessageBrokerClientOptions(
  eventParams: CreateMessageBrokerClientOptionsFactoryParams
): Promise<Module[]> {
  return pluginWrapper(
    () => [],
    EventNames.CreateMessageBrokerClientOptionsFactory,
    eventParams
  );
}
