import {
  FileMap,
  blueprintPluginEventsParams,
} from "@amplication/code-gen-types";
import { AstNode } from "@amplication/csharp-ast";
import {
  blueprintTypes,
  ModuleActionsAndDtos,
} from "@amplication/code-gen-types";
import pluginWrapper from "../plugin-wrapper";
import DsgContext from "../dsg-context";

export async function createModuleFiles(
  moduleActionsAndDto: ModuleActionsAndDtos
): Promise<FileMap<AstNode>> {
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
): Promise<FileMap<AstNode>> {
  const context = DsgContext.getInstance;

  await context.logger.info(`Creating module ${eventParams.moduleName}...`);
  const fileMap = new FileMap<AstNode>(context.logger);
  //do nothing - the event is handled by the blueprint plugin
  await context.logger.info(`Module ${eventParams.moduleName} created`);
  return fileMap;
}
