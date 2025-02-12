import {
  blueprintPluginEventsParams,
  blueprintTypes,
  FileMap,
} from "@amplication/code-gen-types";
import { AstNode } from "@amplication/csharp-ast";
import DsgContext from "../dsg-context";
import pluginWrapper from "../plugin-wrapper";
import { createModulesFiles } from "./create-modules";

export function createBlueprint(): Promise<FileMap<AstNode>> {
  return pluginWrapper(
    createBlueprintInternal,
    blueprintTypes.BlueprintEventNames.createBlueprint,
    {}
  );
}

async function createBlueprintInternal(
  eventParams: blueprintPluginEventsParams.CreateBlueprintParams
): Promise<FileMap<AstNode>> {
  const context = DsgContext.getInstance;

  await context.logger.info("Creating blueprint...");
  const fileMap = new FileMap<AstNode>(context.logger);

  await fileMap.mergeMany([await createModulesFiles()]);

  return fileMap;
}
