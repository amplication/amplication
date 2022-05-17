import type { File } from "@babel/types";
import * as recastBabelParser from "recast/parsers/babel";
import getBabelOptions, { Overrides } from "recast/parsers/_babel_options";

export type Options = ReturnType<typeof getBabelOptions>;

export function parse(source: string, options?: Overrides): File {
  return recastBabelParser.parser.parse(source, getOptions(options));
}

export function getOptions(options?: Overrides): Options {
  const babelOptions = getBabelOptions(options);
  babelOptions.plugins.push("typescript", "jsx");
  return babelOptions;
}
