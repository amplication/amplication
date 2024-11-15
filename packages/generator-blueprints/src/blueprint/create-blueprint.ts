import {
  blueprintPluginEventsParams,
  FileMap,
  blueprintTypes,
  IFile,
} from "@amplication/code-gen-types";
import { AstNode, CodeBlock, CsharpSupport } from "@amplication/csharp-ast";
import DsgContext from "../dsg-context";
import pluginWrapper from "../plugin-wrapper";

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

  const exampleCodeBlock: CodeBlock = CsharpSupport.codeblock({
    code: "Hello, World!",
  });

  const file: IFile<CodeBlock> = {
    path: `example.txt`,
    code: exampleCodeBlock,
  };

  await fileMap.set(file);

  return fileMap;
}
