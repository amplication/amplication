import { EventNames, Module } from "@amplication/code-gen-types";
import pluginWrapper from "../../../plugin-wrapper";

export async function createMessageBrokerServiceModules(): Promise<Module[]> {
  return [
    ...(await pluginWrapper(
      async () => [],
      EventNames.CreateMessageBrokerService,
      {}
    )),
    ...(await pluginWrapper(
      async () => [],
      EventNames.CreateMessageBrokerServiceBase,
      {}
    )),
  ];
}
