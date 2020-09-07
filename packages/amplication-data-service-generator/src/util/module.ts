import * as fs from "fs";
import * as path from "path";
import memoize from "lodash.memoize";
import * as prettier from "prettier";
import { namedTypes } from "ast-types";
import { parse } from "./ast";

export type Variables = { [variable: string]: string | null | undefined };

export type Module = {
  path: string;
  code: string;
};

const JSON_EXT = ".json";

const readCode = memoize(
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

export function relativeImportPath(from: string, to: string): string {
  const relativePath = path.relative(path.dirname(from), removeExt(to));
  return relativePath.startsWith(".") ? relativePath : "./" + relativePath;
}

export function removeExt(filePath: string): string {
  const parsedPath = path.parse(filePath);
  if (parsedPath.ext === JSON_EXT) {
    return filePath;
  }
  return path.join(parsedPath.dir, parsedPath.name);
}
