import { EventNames, ModuleMap } from "@amplication/code-gen-types";
import pluginWrapper from "../../../plugin-wrapper";

export async function createMessageBrokerServiceModules(): Promise<ModuleMap> {
  return new ModuleMap([
    ...(await pluginWrapper(
      async () => new ModuleMap(),
      EventNames.CreateMessageBrokerService,
      {}
    )),
    ...(await pluginWrapper(
      async () => new ModuleMap(),
      EventNames.CreateMessageBrokerServiceBase,
      {}
    )),
  ]);
}
