import {
  FileMap,
  blueprintPluginEventsParams,
} from "@amplication/code-gen-types";
import { IAstNode } from "@amplication/ast-types";

import {
  blueprintTypes,
  ModuleActionsAndDtos,
} from "@amplication/code-gen-types";
import pluginWrapper from "../plugin-wrapper";
import DsgContext from "../dsg-context";

export async function createModuleFiles(
  moduleActionsAndDto: ModuleActionsAndDtos
): Promise<FileMap<IAstNode>> {
  return pluginWrapper(
    createModuleInternal,
    blueprintTypes.BlueprintEventNames.createModule,
    {
      moduleName: moduleActionsAndDto.moduleContainer.name,
      moduleActionsAndDto,
    }
  );
}

async function createModuleInternal(
  eventParams: blueprintPluginEventsParams.CreateModuleParams
): Promise<FileMap<IAstNode>> {
  const context = DsgContext.getInstance;

  await context.logger.info(`Creating module ${eventParams.moduleName}...`);
  const fileMap = new FileMap<IAstNode>(context.logger);
  //do nothing - the event is handled by the blueprint plugin
  await context.logger.info(`Module ${eventParams.moduleName} created`);
  return fileMap;
}
