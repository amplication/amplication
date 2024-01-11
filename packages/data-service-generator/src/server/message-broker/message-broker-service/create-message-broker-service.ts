import DsgContext from "../../../dsg-context";
import pluginWrapper from "../../../plugin-wrapper";
import { EventNames, ModuleMap } from "@amplication/code-gen-types";

export async function createMessageBrokerServiceModules(): Promise<ModuleMap> {
  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);
  await moduleMap.mergeMany([
    await pluginWrapper(
      async () => new ModuleMap(DsgContext.getInstance.logger),
      EventNames.CreateMessageBrokerService,
      {}
    ),
    await pluginWrapper(
      async () => new ModuleMap(DsgContext.getInstance.logger),
      EventNames.CreateMessageBrokerServiceBase,
      {}
    ),
  ]);
  return moduleMap;
}
