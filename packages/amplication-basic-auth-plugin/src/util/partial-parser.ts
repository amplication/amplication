import type { File } from "@babel/types";
import * as recastBabelParser from "recast/parsers/babel";
import { Overrides } from "recast/parsers/_babel_options";
import * as parser from "./parser";

export function parse(source: string, options?: Overrides): File {
  return recastBabelParser.parser.parse(source, getOptions(options));
}

export function getOptions(options?: Overrides): parser.Options {
  const parserOptions = parser.getOptions(options);
  parserOptions.allowAwaitOutsideFunction = true;
  parserOptions.allowReturnOutsideFunction = true;
  parserOptions.allowSuperOutsideMethod = true;
  parserOptions.allowUndeclaredExports = true;
  return parserOptions;
}
