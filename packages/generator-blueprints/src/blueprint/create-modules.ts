import {
  FileMap,
  blueprintPluginEventsParams,
} from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";
import { AstNode } from "@amplication/csharp-ast";
import { blueprintTypes } from "@amplication/code-gen-types";
import pluginWrapper from "../plugin-wrapper";
import { createModuleFiles } from "./create-module";

export async function createModulesFiles(): Promise<FileMap<AstNode>> {
  const { moduleActionsAndDtoMap } = DsgContext.getInstance;

  return pluginWrapper(
    createModulesInternal,
    blueprintTypes.BlueprintEventNames.createModules,
    {
      moduleActionsAndDtoMap,
    }
  );
}

async function createModulesInternal(
  eventParams: blueprintPluginEventsParams.CreateModulesParams
): Promise<FileMap<AstNode>> {
  const context = DsgContext.getInstance;

  await context.logger.info(`Creating modules...`);
  const fileMap = new FileMap<AstNode>(context.logger);

  for (const moduleActionsAndDtos of Object.values(
    eventParams.moduleActionsAndDtoMap
  )) {
    await fileMap.mergeMany([await createModuleFiles(moduleActionsAndDtos)]);
  }

  await context.logger.info(`Modules created`);

  return fileMap;
}
