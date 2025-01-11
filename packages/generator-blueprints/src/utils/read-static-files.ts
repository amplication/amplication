import { FileMap, IFile } from "@amplication/code-gen-types";
import fg from "fast-glob";
import * as fs from "fs";
import normalize from "normalize-path";
import DsgContext from "../dsg-context";

const filesToFilter = /(\._.*)|(.DS_Store)$/;

export async function readPluginStaticFiles(
  source: string,
  basePath: string
): Promise<FileMap<string>> {
  const directory = `${normalize(source)}/`;
  const staticFiles = await fg(`${directory}**/*`, {
    absolute: false,
    dot: true,
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
