import {
  CreateMessageBrokerParams,
  EventNames,
  ModuleMap,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../plugin-wrapper";
import { createMessageBrokerClientOptions } from "./generate-message-broker-client-options/generate-message-broker-client-options";
import { createMessageBrokerModule } from "./message-broker-module/create-message-broker-module";
import { createMessageBrokerServiceModules } from "./message-broker-service/create-message-broker-service";
import { createTopicsEnum } from "./topics-enum/createTopicsEnum";
import { logger } from "../../logging";

export async function createMessageBroker(
  eventParams: CreateMessageBrokerParams
): Promise<ModuleMap> {
  return pluginWrapper(
    createMessageBrokerInternal,
    EventNames.CreateMessageBroker,
    eventParams
  );
}

export async function createMessageBrokerInternal(
  eventParams: CreateMessageBrokerParams
): Promise<ModuleMap> {
  const generateMessageBrokerClientOptionsModule =
    await createMessageBrokerClientOptions({});
  const messageBrokerModule = await createMessageBrokerModule({});
  const serviceModules = await createMessageBrokerServiceModules();
  const topicsEnum = await createTopicsEnum({});

  const messageBrokerModules = new ModuleMap();

  messageBrokerModules.merge(generateMessageBrokerClientOptionsModule, logger);
  messageBrokerModules.merge(messageBrokerModule, logger);
  messageBrokerModules.merge(serviceModules, logger);
  topicsEnum && messageBrokerModules.merge(topicsEnum, logger);

  return messageBrokerModules;
}
