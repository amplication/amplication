import {
  CreateServerParams,
  FileMap,
  dotnetTypes,
} from "@amplication/code-gen-types";
import { AstNode } from "@amplication/csharp-ast";
import path from "path";
import DsgContext from "../dsg-context";
import pluginWrapper from "../plugin-wrapper";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");

export function createBlueprint(): Promise<FileMap<AstNode>> {
  return pluginWrapper(
    createBlueprintInternal,
    dotnetTypes.DotnetEventNames.CreateServer,
    {}
  );
}

async function createBlueprintInternal(
  eventParams: CreateServerParams
): Promise<FileMap<AstNode>> {
  const context = DsgContext.getInstance;

  await context.logger.info("Creating blueprint...");
  const fileMap = new FileMap<AstNode>(context.logger);

  return fileMap;
}
