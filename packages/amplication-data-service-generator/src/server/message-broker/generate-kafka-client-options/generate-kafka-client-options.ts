import {
  CreateMessageBrokerClientOptionsFactoryParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import pluginWrapper from "../../../plugin-wrapper";

const templatePath = resolve(
  __dirname,
  "generateKafkaClientOptions.template.ts"
);

export async function createGenerateKafkaClientOptionsFunction(
  eventParams: CreateMessageBrokerClientOptionsFactoryParams["before"]
) {
  return pluginWrapper(
    createGenerateKafkaClientOptionsFunctionInternal,
    EventNames.CreateMessageBrokerClientOptionsFactory,
    eventParams
  );
}

export async function createGenerateKafkaClientOptionsFunctionInternal(
  eventParams: CreateMessageBrokerClientOptionsFactoryParams["before"]
): Promise<Module[]> {
  const template = await readFile(templatePath, "utf8");
  const generateFileName = "generateKafkaClientOptions.ts";
  return [
    {
      code: template,
      path: join(kafkaFolder, generateFileName),
    },
  ];
}
