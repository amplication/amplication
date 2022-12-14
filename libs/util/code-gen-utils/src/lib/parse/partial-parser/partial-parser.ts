import { ParserOptions } from "@babel/parser";
import type { File } from "@babel/types";
import { namedTypes } from "ast-types";
import * as recast from "recast";
import * as recastBabelParser from "recast/parsers/babel";
import { Overrides } from "recast/parsers/_babel_options";
import { ParseError } from "../errors/ParseError";
import { getOptions as parserGetOptions, Options } from "../main";

type PartialParseOptions = Omit<ParserOptions, "tolerant">;

function getOptions(options?: Overrides): Options {
  const parserOptions = parserGetOptions(options);
  parserOptions.allowAwaitOutsideFunction = true;
  parserOptions.allowReturnOutsideFunction = true;
  parserOptions.allowSuperOutsideMethod = true;
  parserOptions.allowUndeclaredExports = true;
  return parserOptions;
}

/**
 * Wraps recast.parse()
 * Sets parser to use the TypeScript parser with looser restrictions
 */
export function partialParse(
  source: string,
  options?: PartialParseOptions
): namedTypes.File {
  try {
    return recast.parse(source, {
      ...options,
      tolerant: true,
      parser: {
        parse: (source: string, options?: Overrides): File => {
          return recastBabelParser.parser.parse(source, getOptions(options));
        },
        getOptions,
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ParseError(error.message, source);
    }
    throw error;
  }
}
