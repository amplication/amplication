import {
  CreateMessageBrokerParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import DsgContext from "../../dsg-context";
import pluginWrapper from "../../plugin-wrapper";
import { createGenerateKafkaClientOptionsFunction } from "./generate-kafka-client-options/generate-kafka-client-options";
import { createKafkaModule } from "./kafka-module/create-kafka-module";
import { createKafkaServiceModules } from "./kafka-service/create-kafka-service";
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

  const generateKafkaClientOptionsModule = await createGenerateKafkaClientOptionsFunction(
    messageBrokerDirectory
  );
  const kafkaModule = await createKafkaModule(messageBrokerDirectory);
  const serviceModules = await createKafkaServiceModules(
    messageBrokerDirectory
  );
  const topicsEnum = await createTopicsEnum({ serviceTopicsWithName });
  const modules = [
    ...generateKafkaClientOptionsModule,
    ...kafkaModule,
    ...serviceModules,
  ];
  topicsEnum && modules.push(...topicsEnum);
  return [...modules];
}
