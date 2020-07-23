import * as fs from "fs";
import * as path from "path";
import memoize from "lodash.memoize";
import * as prettier from "prettier";

export type Variables = { [variable: string]: string | null | undefined };

export type Module = {
  path: string;
  code: string;
};

const readCode = memoize(
  (path: string): Promise<string> => fs.promises.readFile(path, "utf-8")
);

export { readCode };

export const formatCode = (code: string): string => {
  return prettier.format(code, { parser: "typescript" });
};

export function relativeImportPath(from: string, to: string): string {
  const relativePath = path.relative(path.dirname(from), removeExt(to));
  return relativePath.startsWith(".") ? relativePath : "./" + relativePath;
}

function removeExt(filePath: string): string {
  const parsedPath = path.parse(filePath);
  return path.join(parsedPath.dir, parsedPath.name);
}
