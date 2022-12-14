import { namedTypes } from "ast-types";
import * as recast from "recast";
import { ParseError } from "../errors/ParseError";
import { partialParse } from "./partial-parser";

describe("partialParser", () => {
  test("parses await expression", () => {
    const file = partialParse("await f()");
    expect(file.program.body.length).toBe(1);
    const [statement] = file.program.body;
    namedTypes.ExpressionStatement.assert(statement) &&
      namedTypes.AwaitExpression.assert(statement.expression);
  });
});

describe("partialParse", () => {
  test.skip("partially parses", () => {
    const EXAMPLE_SOURCE = "exampleSource";
    expect(() => partialParse(EXAMPLE_SOURCE)).toEqual(
      recast.parse(EXAMPLE_SOURCE, {
        tolerant: true,
        parser: { partialParse },
      })
    );
  });

  test("tries to partially parse but catches a SyntaxError", () => {
    const EXAMPLE_ERROR = new SyntaxError("exampleError");
    const EXAMPLE_SOURCE = "exampleSource";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    recast.parse.mockImplementationOnce(() => {
      throw EXAMPLE_ERROR;
    });
    expect(() => partialParse(EXAMPLE_SOURCE)).toThrow(
      new ParseError(EXAMPLE_ERROR.message, EXAMPLE_SOURCE)
    );
  });

  test("tries to partially parse but catches an Error", () => {
    const EXAMPLE_ERROR = new Error("exampleError");
    const EXAMPLE_SOURCE = "exampleSource";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    recast.parse.mockImplementationOnce(() => {
      throw EXAMPLE_ERROR;
    });
    expect(() => partialParse(EXAMPLE_SOURCE)).toThrow(EXAMPLE_ERROR);
  });
});
