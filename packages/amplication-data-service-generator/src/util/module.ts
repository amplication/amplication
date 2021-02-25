import * as fs from "fs";
import * as path from "path";
import memoize from "lodash.memoize";
import * as prettier from "prettier";
import { namedTypes } from "ast-types";
import normalize from "normalize-path";
import { parse } from "./ast";

export type Variables = { [variable: string]: string | null | undefined };

const JSON_EXT = ".json";

export const readCode = memoize(
  (path: string): Promise<string> => {
    return fs.promises.readFile(path, "utf-8");
  }
);

const readFile = async (path: string): Promise<namedTypes.File> => {
  const code = await readCode(path);
  return parse(code) as namedTypes.File;
};

export { readFile };

export const formatCode = (code: string): string => {
  return prettier.format(code, { parser: "typescript" });
};

export const formatJson = (code: string): string => {
  return prettier.format(code, { parser: "json" });
};

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
