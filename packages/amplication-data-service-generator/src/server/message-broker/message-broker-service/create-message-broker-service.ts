import {
  CreateMessageBrokerServiceParams,
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
  const serviceModule = await createMessageBrokerServiceModule({
    baseService: false,
  });
  const baseServiceModule = await createMessageBrokerServiceModule({
    baseService: true,
  });
  return [...serviceModule, ...baseServiceModule];
}

function createMessageBrokerServiceModule(
  eventParams: CreateMessageBrokerServiceParams["before"]
): Promise<Module[]> {
  return pluginWrapper(
    createMessageBrokerServiceModuleInternal,
    EventNames.CreateMessageBrokerService,
    eventParams
  );
}

async function createMessageBrokerServiceModuleInternal(
  eventParams: CreateMessageBrokerServiceParams["before"]
): Promise<Module[]> {
  return [];
}
