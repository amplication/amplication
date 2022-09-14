import {
  CreateMessageBrokerParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import { join } from "path";
import pluginWrapper from "../../plugin-wrapper";
import { createGenerateKafkaClientOptionsFunction } from "./generate-kafka-client-options/generate-kafka-client-options";
import { createKafkaModule } from "./kafka-module/create-kafka-module";
import { createKafkaServiceModules } from "./kafka-service/create-kafka-service";
import { createTopicsEnum } from "./topics-enum/createTopicsEnum";

export function createMessageBroker(
  eventParams: CreateMessageBrokerParams["before"]
): Module[] {
  return pluginWrapper(
    createMessageBrokerInternal,
    EventNames.CreateMessageBroker,
    eventParams
  );
}

export async function createMessageBrokerInternal({
  serviceTopicsWithName,
  srcFolder,
}: CreateMessageBrokerParams["before"]): Promise<Module[]> {
  const kafkaFolder = join(srcFolder, "kafka");
  const generateKafkaClientOptionsModule = await createGenerateKafkaClientOptionsFunction(
    kafkaFolder
  );
  const kafkaModule = await createKafkaModule(kafkaFolder);
  const serviceModules = await createKafkaServiceModules(kafkaFolder);
  const topicsEnum = await createTopicsEnum(kafkaFolder);
  const modules = [
    generateKafkaClientOptionsModule,
    kafkaModule,
    ...serviceModules,
  ];
  topicsEnum && modules.push(topicsEnum);
  return [...modules];
}
