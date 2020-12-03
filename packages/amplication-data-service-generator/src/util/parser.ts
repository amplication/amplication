import * as recastBabelParser from "recast/parsers/babel";
import getBabelOptions, { Overrides } from "recast/parsers/_babel_options";

export function parse(
  source: string,
  options?: Overrides
): import("@babel/types").File {
  const babelOptions = getBabelOptions(options);
  babelOptions.plugins.push("typescript", "jsx");
  return recastBabelParser.parser.parse(source, babelOptions);
}
