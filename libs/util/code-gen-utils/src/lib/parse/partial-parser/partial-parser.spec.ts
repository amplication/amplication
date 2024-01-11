import { partialParse } from "./partial-parser";
import { namedTypes } from "ast-types";
import * as recast from "recast";

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
});
