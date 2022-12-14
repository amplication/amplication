import * as path from "path";

import normalize from "normalize-path";

export type Variables = { [variable: string]: string | null | undefined };

const JSON_EXT = ".json";

/**
 * @param from filePath of the module to import from
 * @param to filePath of the module to import to
 */
export function relativeImportPath(from: string, to: string): string {
  const relativePath = path.relative(path.dirname(from), to);
  return filePathToModulePath(relativePath);
}

/**
 * @param filePath path to the file to import
 * @returns module path of the given file path
 */
export function filePathToModulePath(filePath: string): string {
  const parsedPath = path.parse(filePath);
  const fixedExtPath =
    parsedPath.ext === JSON_EXT
      ? filePath
      : path.join(parsedPath.dir, parsedPath.name);
  const normalizedPath = normalize(fixedExtPath);
  return normalizedPath.startsWith("/") || normalizedPath.startsWith(".")
    ? normalizedPath
    : "./" + normalizedPath;
}
