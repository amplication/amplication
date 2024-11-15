import * as fs from "fs";
import normalize from "normalize-path";
import fg from "fast-glob";
import {
  dotnetTypes,
  FileMap,
  IFile,
  dotnetPluginEventsParams,
} from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";
import pluginWrapper from "../plugin-wrapper";
import { CodeBlock, CsharpSupport } from "@amplication/csharp-ast";
import { pascalCase } from "pascal-case";

const filesToFilter = /(\._.*)|(.DS_Store)$/;

const NAMESPACE_KEY = "${{ RESOURCE_NAMESPACE }}";

export async function readStaticFiles(
  source: string,
  basePath: string
): Promise<FileMap<CodeBlock>> {
  return pluginWrapper(
    readStaticModulesInner,
    dotnetTypes.DotnetEventNames.LoadStaticFiles,
    {
      source,
      basePath,
    }
  );
}

/**
 * Reads files from given source directory and maps them to module objects with
 * path relative to given basePath
 * @param source source directory to read files from
 * @param basePath path to base the created modules path on
 * @returns array of modules
 */
export async function readStaticModulesInner({
  source,
  basePath,
}: dotnetPluginEventsParams.LoadStaticFilesParams): Promise<
  FileMap<CodeBlock>
> {
  const {
    logger,
    resourceInfo: { name: resourceName },
  } = DsgContext.getInstance;

  const directory = `${normalize(source)}/`;
  let staticFilesPath = await fg(`${directory}**/*`, {
    absolute: false,
    dot: true,
  });

  staticFilesPath = staticFilesPath.filter(
    (module) =>
      !filesToFilter.test(
        module.replace(directory, basePath ? basePath + "/" : "")
      )
  );

  return staticFilesPath.reduce(async (fileMapPromise, filePath) => {
    const fileMap = await fileMapPromise;
    const fileContent = await fs.promises.readFile(filePath, "utf-8");

    await fileMap.set({
      path: filePath.replace(directory, basePath ? basePath + "/" : ""),
      code: CsharpSupport.codeblock({
        code: fileContent.replaceAll(NAMESPACE_KEY, pascalCase(resourceName)),
      }),
    });
    return fileMap;
  }, Promise.resolve(new FileMap<CodeBlock>(logger)));
}

export async function readPluginStaticFiles(
  source: string,
  basePath: string
): Promise<FileMap<string>> {
  const directory = `${normalize(source)}/`;
  const staticFiles = await fg(`${directory}**/*`, {
    absolute: false,
    dot: true,
    ignore: ["**.js", "**.js.map", "**.d.ts"],
  });

  const fileMap = new FileMap<string>(DsgContext.getInstance.logger);

  for await (const module of staticFiles
    .sort()
    .filter(
      (module) =>
        !filesToFilter.test(
          module.replace(directory, basePath ? basePath + "/" : "")
        )
    )) {
    const file: IFile<string> = {
      path: module.replace(directory, basePath ? basePath + "/" : ""),
      code: await fs.promises.readFile(module, "utf-8"),
    };
    await fileMap.set(file);
  }

  return fileMap;
}
