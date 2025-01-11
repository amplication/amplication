import {
  blueprintPluginEventsParams,
  blueprintTypes,
  FileMap,
} from "@amplication/code-gen-types";
import { AstNode } from "@amplication/csharp-ast";
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

  // const staticPath = "./src/utils";

  // const staticFiles = await context.utils.importStaticFiles(staticPath, "./");

  // console.log({ staticFiles });

  // for (const item of staticFiles.getAll()) {
  //   const file: IFile<CodeBlock> = {
  //     path: item.path,
  //     code: new CodeBlock({
  //       code: item.code,
  //     }),
  //   };
  //   await fileMap.set(file);
  // }

  return fileMap;
}
