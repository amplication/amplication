import {
  EventNames,
  ModuleMap,
  Module,
  CreateConnectMicroservicesParams,
} from "@amplication/code-gen-types";
import DsgContext from "../../dsg-context";
import pluginWrapper from "../../plugin-wrapper";
import { readFile, print } from "@amplication/code-gen-utils";

const controllerTemplatePath = require.resolve(
  "./connect-microservices.template.ts"
);

export async function connectMicroservices(): Promise<ModuleMap> {
  const template = await readFile(controllerTemplatePath);

  return pluginWrapper(
    connectMicroservicesInternal,
    EventNames.CreateConnectMicroservices,
    { template }
  );
}

async function connectMicroservicesInternal({
  template,
}: CreateConnectMicroservicesParams): Promise<ModuleMap> {
  const context = DsgContext.getInstance;
  const module: Module = {
    path: `${context.serverDirectories.srcDirectory}/connectMicroservices.ts`,
    code: print(template).code,
  };

  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.set(module);
  return moduleMap;
}
