import {
  CreateMessageBrokerServiceParams,
  CreateMessageBrokerServicesParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../../plugin-wrapper";

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
