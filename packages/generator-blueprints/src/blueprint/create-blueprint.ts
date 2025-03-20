import {
  blueprintPluginEventsParams,
  blueprintTypes,
  FileMap,
} from "@amplication/code-gen-types";
import { IAstNode } from "@amplication/ast-types";
import DsgContext from "../dsg-context";
import pluginWrapper from "../plugin-wrapper";
import { createModulesFiles } from "./create-modules";

export function createBlueprint(): Promise<FileMap<IAstNode>> {
  return pluginWrapper(
    createBlueprintInternal,
    blueprintTypes.BlueprintEventNames.createBlueprint,
    {}
  );
}

async function createBlueprintInternal(
  eventParams: blueprintPluginEventsParams.CreateBlueprintParams
): Promise<FileMap<IAstNode>> {
  const context = DsgContext.getInstance;

  await context.logger.info("Creating blueprint...");
  const fileMap = new FileMap<IAstNode>(context.logger);

  await fileMap.mergeMany([await createModulesFiles()]);

  return fileMap;
}
