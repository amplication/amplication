import { ParseError } from "./errors/ParseError";
import { parse } from "./main";

/* eslint-disable @typescript-eslint/ban-ts-comment */
describe("parse", () => {
  test("tries to parse but catches a SyntaxError", () => {
    const EXAMPLE_ERROR = new SyntaxError("exampleError");
    const EXAMPLE_SOURCE = "exampleSource";
    // @ts-ignore
    recast.parse.mockImplementationOnce(() => {
      throw EXAMPLE_ERROR;
    });
    expect(() => parse(EXAMPLE_SOURCE)).toThrow(
      new ParseError(EXAMPLE_ERROR.message, EXAMPLE_SOURCE)
    );
  });

  test("tries to parse but catches an Error", () => {
    const EXAMPLE_ERROR = new Error("exampleError");
    const EXAMPLE_SOURCE = "exampleSource";
    // @ts-ignore
    recast.parse.mockImplementationOnce(() => {
      throw EXAMPLE_ERROR;
    });
    expect(() => parse(EXAMPLE_SOURCE)).toThrow(EXAMPLE_ERROR);
  });
});
