import {
  CreateMessageBrokerClientOptionsFactoryParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import DsgContext from "../../../dsg-context";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import pluginWrapper from "../../../plugin-wrapper";

const templatePath = resolve(
  __dirname,
  "generateKafkaClientOptions.template.ts"
);

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
  const { serverDirectories } = DsgContext.getInstance;
  const template = await readFile(templatePath, "utf8");
  const generateFileName = "generateKafkaClientOptions.ts";
  return [
    {
      code: template,
      path: join(serverDirectories.messageBrokerDirectory, generateFileName),
    },
  ];
}
