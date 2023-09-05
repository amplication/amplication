import { namedTypes } from "ast-types";
import { readFile as fsReadFile } from "fs/promises";
import { memoize } from "lodash";
import { format } from "prettier";
import { parse } from "./parse/main";

export const formatCode = (code: string): string => {
  return format(code, { parser: "typescript" });
};

export const formatJson = (code: string): string => {
  return format(code, { parser: "json" });
};

export const readCode = memoize((path: string): Promise<string> => {
  return fsReadFile(path, "utf-8");
});

export const readFile = async (path: string): Promise<namedTypes.File> => {
  const code = await readCode(path);
  return parse(code) as namedTypes.File;
};

export { print } from "recast";
