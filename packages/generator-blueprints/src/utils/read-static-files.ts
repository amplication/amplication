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

export async function importStaticFilesWithReplacements(
  source: string,
  basePath: string,
  placeholders: Record<string, string>,
  stringReplacements: Record<string, string>
): Promise<FileMap<string>> {
  const files = new FileMap<string>(DsgContext.getInstance.logger);

  const staticFiles = await readPluginStaticFiles(source, basePath);

  for (const item of staticFiles.getAll()) {
    item.code = replacePlaceholders(item.code, placeholders);
    item.path = replacePlaceholders(item.path, placeholders);

    item.code = replaceText(item.code, stringReplacements);
    item.path = replaceText(item.path, stringReplacements);

    const file: IFile<string> = {
      path: item.path,
      code: item.code,
    };
    await files.set(file);
  }

  return files;
}

export function replacePlaceholders(
  template: string,
  replacements: Record<string, string>
): string {
  return template.replace(/{{(.*?)}}/g, (match, key) => {
    // Return the replacement value if it exists (even if it's an empty string)
    // Otherwise, keep the placeholder
    return Object.prototype.hasOwnProperty.call(replacements, key.trim())
      ? replacements[key.trim()]
      : match;
  });
}

export function replaceText(
  template: string,
  replacements: Record<string, string>
): string {
  return Object.entries(replacements).reduce((result, [key, value]) => {
    return result.replaceAll(key, value);
  }, template);
}
