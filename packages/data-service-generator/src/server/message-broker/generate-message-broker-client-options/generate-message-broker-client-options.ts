import {
  CreateMessageBrokerClientOptionsFactoryParams,
  EventNames,
  ModuleMap,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../../plugin-wrapper";
import DsgContext from "../../../dsg-context";

export async function createMessageBrokerClientOptions(
  eventParams: CreateMessageBrokerClientOptionsFactoryParams
): Promise<ModuleMap> {
  return pluginWrapper(
    () => new ModuleMap(DsgContext.getInstance.logger),
    EventNames.CreateMessageBrokerClientOptionsFactory,
    eventParams
  );
}
