import {
  CreateMessageBrokerParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import DsgContext from "../../dsg-context";
import pluginWrapper from "../../plugin-wrapper";
import { createGenerateMessageBrokerClientOptionsFunction } from "./generate-message-broker-client-options/generate-message-broker-client-options";
import { createMessageBrokerModule } from "./message-broker-module/create-message-broker-module";
import { createMessageBrokerServiceModules } from "./message-broker-service/create-message-broker-service";
import { createTopicsEnum } from "./topics-enum/createTopicsEnum";

export async function createMessageBroker(
  eventParams: CreateMessageBrokerParams["before"]
): Promise<Module[]> {
  return pluginWrapper(
    createMessageBrokerInternal,
    EventNames.CreateMessageBroker,
    eventParams
  );
}

export async function createMessageBrokerInternal({
  serviceTopicsWithName,
}: CreateMessageBrokerParams["before"]): Promise<Module[]> {
  const { serverDirectories } = DsgContext.getInstance;
  const { messageBrokerDirectory } = serverDirectories;

  const generateMessageBrokerClientOptionsModule = await createGenerateMessageBrokerClientOptionsFunction(
    messageBrokerDirectory
  );
  const messageBrokerModule = await createMessageBrokerModule(
    messageBrokerDirectory
  );
  const serviceModules = await createMessageBrokerServiceModules({});
  const topicsEnum = await createTopicsEnum({ serviceTopicsWithName });
  const modules = [
    ...generateMessageBrokerClientOptionsModule,
    ...messageBrokerModule,
    ...serviceModules,
  ];
  topicsEnum && modules.push(...topicsEnum);
  return [...modules];
}
