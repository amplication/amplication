import {
  CreateMessageBrokerNestJSModuleParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { print } from "recast";
import DsgContext from "../../../dsg-context";
import pluginWrapper from "../../../plugin-wrapper";
import { parse, removeTSIgnoreComments } from "../../../util/ast";

const templatePath = resolve(__dirname, "kafka.module.template.ts");

export function createKafkaModule(
  eventParams: CreateMessageBrokerNestJSModuleParams["before"]
) {
  return pluginWrapper(
    createKafkaModuleInternal,
    EventNames.CreateMessageBrokerNestJSModule,
    eventParams
  );
}

export async function createKafkaModuleInternal(
  eventParams: CreateMessageBrokerNestJSModuleParams["before"]
): Promise<Module[]> {
  const { serverDirectories } = DsgContext.getInstance;
  const template = await readFile(templatePath, "utf8");
  const generateFileName = "kafka.module.ts";
  const astFile = parse(template);

  removeTSIgnoreComments(astFile);

  const code = print(astFile).code;
  return [
    {
      code: code,
      path: join(serverDirectories.messageBrokerDirectory, generateFileName), //TODO get it from context
    },
  ];
}
