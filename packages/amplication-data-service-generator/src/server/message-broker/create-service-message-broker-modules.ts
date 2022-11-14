import {
  CreateMessageBrokerParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../plugin-wrapper";
import { createMessageBrokerClientOptions } from "./generate-message-broker-client-options/generate-message-broker-client-options";
import { createMessageBrokerModule } from "./message-broker-module/create-message-broker-module";
import { createMessageBrokerServiceModules } from "./message-broker-service/create-message-broker-service";
import { createTopicsEnum } from "./topics-enum/createTopicsEnum";

export async function createMessageBroker(
  eventParams: CreateMessageBrokerParams
): Promise<Module[]> {
  return pluginWrapper(
    createMessageBrokerInternal,
    EventNames.CreateMessageBroker,
    eventParams
  );
}

export async function createMessageBrokerInternal(
  eventParams: CreateMessageBrokerParams
): Promise<Module[]> {
  const generateMessageBrokerClientOptionsModule =
    await createMessageBrokerClientOptions({});
  const messageBrokerModule = await createMessageBrokerModule({});
  const serviceModules = await createMessageBrokerServiceModules();
  const topicsEnum = await createTopicsEnum({});
  const modules = [
    ...generateMessageBrokerClientOptionsModule,
    ...messageBrokerModule,
    ...serviceModules,
  ];
  topicsEnum && modules.push(...topicsEnum);
  return modules;
}
