import * as fs from "fs";
import normalize from "normalize-path";
import fg from "fast-glob";
import {
  EventNames,
  Module,
  LoadStaticFilesParams,
  ModuleMap,
} from "@amplication/code-gen-types";
import pluginWrapper from "../plugin-wrapper";
import { getFileEncoding } from "./get-file-encoding";
import DsgContext from "../dsg-context";

const filesToFilter = /(\._.*)|(.DS_Store)$/;

export async function readStaticModules(
  source: string,
  basePath: string
): Promise<ModuleMap> {
  return pluginWrapper(readStaticModulesInner, EventNames.LoadStaticFiles, {
    source,
    basePath,
  });
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
}: LoadStaticFilesParams): Promise<ModuleMap> {
  const directory = `${normalize(source)}/`;
  const staticModules = await fg(`${directory}**/*`, {
    absolute: false,
    dot: true,
    ignore: ["**.js", "**.js.map", "**.d.ts"],
  });

  const modules = await Promise.all(
    staticModules
      .sort()
      .filter(
        (module) =>
          !filesToFilter.test(
            module.replace(directory, basePath ? basePath + "/" : "")
          )
      )
      .map(async (module) => {
        const encoding = getFileEncoding(module);
        return {
          path: module.replace(directory, basePath ? basePath + "/" : ""),
          code: await fs.promises.readFile(module, encoding),
        };
      })
  );
  const moduleMap: ModuleMap = new ModuleMap(DsgContext.getInstance.logger);
  for await (const module of modules) {
    await moduleMap.set(module);
  }
  return moduleMap;
}

export async function readPluginStaticModules(
  source: string,
  basePath: string
): Promise<ModuleMap> {
  const directory = `${normalize(source)}/`;
  const staticModules = await fg(`${directory}**/*`, {
    absolute: false,
    dot: true,
    ignore: ["**.js", "**.js.map", "**.d.ts"],
  });

  const moduleMap: ModuleMap = new ModuleMap(DsgContext.getInstance.logger);

  for await (const module of staticModules
    .sort()
    .filter(
      (module) =>
        !filesToFilter.test(
          module.replace(directory, basePath ? basePath + "/" : "")
        )
    )) {
    const file: Module = {
      path: module.replace(directory, basePath ? basePath + "/" : ""),
      code: await fs.promises.readFile(module, "utf-8"),
    };
    await moduleMap.set(file);
  }

  return moduleMap;
}
