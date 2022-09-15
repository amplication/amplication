import {
  CreateMessageBrokerClientOptionsFactoryParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../../plugin-wrapper";

export async function createGenerateMessageBrokerClientOptionsFunction(
  eventParams: CreateMessageBrokerClientOptionsFactoryParams["before"]
): Promise<Module[]> {
  return pluginWrapper(
    createGenerateMessageBrokerClientOptionsFunctionInternal,
    EventNames.CreateMessageBrokerClientOptionsFactory,
    eventParams
  );
}

export async function createGenerateMessageBrokerClientOptionsFunctionInternal(
  eventParams: CreateMessageBrokerClientOptionsFactoryParams["before"]
): Promise<Module[]> {
  return [];
}
