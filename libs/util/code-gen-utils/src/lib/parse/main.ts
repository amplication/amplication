import type { File } from "@babel/types";
import { namedTypes } from "ast-types";
import * as recast from "recast";
import * as recastBabelParser from "recast/parsers/babel";
import getBabelOptions, { Overrides } from "recast/parsers/_babel_options";
import { ParseError } from "./errors/ParseError";

export function getOptions(options?: Overrides): Options {
  const babelOptions = getBabelOptions(options);
  babelOptions.plugins.push("typescript", "jsx");
  return babelOptions;
}

type ParseOptions = Omit<recast.Options, "parser">;

export type Options = ReturnType<typeof getBabelOptions>;

/**
 * Wraps recast.parse()
 * Sets parser to use the TypeScript parser
 */
export function parse(source: string, options?: ParseOptions): namedTypes.File {
  try {
    return recast.parse(source, {
      ...{
        parser: {
          getOptions,
          parse: (source: string, options?: Overrides): File => {
            return recastBabelParser.parser.parse(source, getOptions(options));
          },
        },
      },
      ...options,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ParseError(error.message, source);
    }
    throw error;
  }
}
