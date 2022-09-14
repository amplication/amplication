import {
  CreateMessageBrokerServicesParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import DsgContext from "../../../dsg-context";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import pluginWrapper from "../../../plugin-wrapper";
import { print } from "recast";
import { parse, removeTSIgnoreComments } from "../../../util/ast";

export async function createMessageBrokerServiceModules(
  eventParams: CreateMessageBrokerServicesParams["before"]
): Promise<Module[]> {
  return pluginWrapper(
    createMessageBrokerServiceModulesInternal,
    EventNames.CreateMessageBrokerServices,
    eventParams
  );
}

export async function createMessageBrokerServiceModulesInternal(
  eventParams: CreateMessageBrokerServicesParams["before"]
): Promise<Module[]> {
  const serviceModule = await createMessageBrokerServiceModule(false);
  const baseServiceModule = await createMessageBrokerServiceModule(true);
  return [...serviceModule, ...baseServiceModule];
}

async function createMessageBrokerServiceModule(
  baseService: boolean
): Promise<Module[]> {
  const { serverDirectories } = DsgContext.getInstance;
  const { messageBrokerDirectory } = serverDirectories;
  const templatePath = resolve(
    __dirname,
    `kafka.service${baseService ? ".base" : ""}.template.ts`
  );

  const template = await readFile(templatePath, "utf8");
  const generateFileName = `kafka.service${baseService ? ".base" : ""}.ts`;
  const astFile = parse(template);

  removeTSIgnoreComments(astFile);

  const code = print(astFile).code;
  const path = join(
    messageBrokerDirectory,
    baseService ? "base" : "",
    generateFileName
  );
  return [{ code, path }];
}
