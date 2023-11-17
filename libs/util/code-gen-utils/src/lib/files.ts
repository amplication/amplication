import { namedTypes } from "ast-types";
import { readFile as fsReadFile } from "fs/promises";
import { memoize } from "lodash";
import { format } from "prettier";
import { parse } from "./parse/main";

export const formatCode = (path: string, code: string): string => {
  if (path.endsWith(".ts") || path.endsWith(".tsx")) {
    return format(code, { parser: "typescript" });
  }
  if (path.endsWith(".json")) {
    return format(code, { parser: "json" });
  }
  if (path.endsWith(".yml") || path.endsWith(".yaml")) {
    return format(code, { parser: "yaml" });
  }
  if (path.endsWith(".md")) {
    return format(code, { parser: "markdown" });
  }
  if (path.endsWith(".graphql")) {
    return format(code, { parser: "graphql" });
  }
  return code;
};

export const readCode = memoize((path: string): Promise<string> => {
  return fsReadFile(path, "utf-8");
});

export const readFile = async (path: string): Promise<namedTypes.File> => {
  const code = await readCode(path);
  return parse(code) as namedTypes.File;
};

export { print } from "recast";
