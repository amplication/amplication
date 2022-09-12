import { Module } from "@amplication/code-gen-types";
import { join } from "path";
import { createGenerateKafkaClientOptionsFunction } from "./generate-kafka-client-options/generate-kafka-client-options";
import { createKafkaModule } from "./kafka-module/create-kafka-module";
import { createKafkaServiceModules } from "./kafka-service/create-kafka-service";

export async function createMessageBrokerModules(
  srcFolder: string
): Promise<Module[]> {
  const kafkaFolder = join(srcFolder, "kafka");
  const generateKafkaClientOptionsModule = await createGenerateKafkaClientOptionsFunction(
    kafkaFolder
  );
  const kafkaModule = await createKafkaModule(kafkaFolder);
  const serviceModules = await createKafkaServiceModules(kafkaFolder);

  return [generateKafkaClientOptionsModule, kafkaModule, ...serviceModules];
}

// export function createServiceMessageBrokerTopicsEnum(): Module {}
