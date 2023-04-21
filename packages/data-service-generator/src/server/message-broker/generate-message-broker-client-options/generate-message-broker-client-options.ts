import {
  CreateMessageBrokerClientOptionsFactoryParams,
  EventNames,
  ModuleMap,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../../plugin-wrapper";

export async function createMessageBrokerClientOptions(
  eventParams: CreateMessageBrokerClientOptionsFactoryParams
): Promise<ModuleMap> {
  return pluginWrapper(
    () => new ModuleMap(),
    EventNames.CreateMessageBrokerClientOptionsFactory,
    eventParams
  );
}
