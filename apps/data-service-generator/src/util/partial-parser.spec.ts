import { namedTypes } from "ast-types";
import * as partialParser from "./partial-parser";

describe("partialParser", () => {
  test("parses await expression", () => {
    const file = partialParser.parse("await f()");
    expect(file.program.body.length).toBe(1);
    const [statement] = file.program.body;
    namedTypes.ExpressionStatement.assert(statement) &&
      namedTypes.AwaitExpression.assert(statement.expression);
  });
});
