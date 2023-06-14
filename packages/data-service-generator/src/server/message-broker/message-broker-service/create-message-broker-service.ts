import { EventNames, ModuleMap } from "@amplication/code-gen-types";
import pluginWrapper from "../../../plugin-wrapper";
import DsgContext from "../../../dsg-context";

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
