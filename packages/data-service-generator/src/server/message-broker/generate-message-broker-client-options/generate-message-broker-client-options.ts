import DsgContext from "../../../dsg-context";
import pluginWrapper from "../../../plugin-wrapper";
import {
  CreateMessageBrokerClientOptionsFactoryParams,
  EventNames,
  ModuleMap,
} from "@amplication/code-gen-types";

export async function createMessageBrokerClientOptions(
  eventParams: CreateMessageBrokerClientOptionsFactoryParams
): Promise<ModuleMap> {
  return pluginWrapper(
    () => new ModuleMap(DsgContext.getInstance.logger),
    EventNames.CreateMessageBrokerClientOptionsFactory,
    eventParams
  );
}
