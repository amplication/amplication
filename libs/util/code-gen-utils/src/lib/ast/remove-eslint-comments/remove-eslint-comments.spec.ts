import { print } from "recast";
import { parse } from "../../parse/main";
import { removeESLintComments } from "./main";

describe("removeESLintComments", () => {
  test("removes ESLint block comments", () => {
    const file = parse(`/* eslint-disable */ function f(x) { return x * 2 }`);
    removeESLintComments(file);
    expect(print(file).code).toEqual(`function f(x) { return x * 2 }`);
  });
  test("removes ESLint line comments", () => {
    const file = parse(
      `// eslint-disable-next-line
        function f(x) { return x * 2 }`
    );
    removeESLintComments(file);
    expect(print(file).code).toEqual(`function f(x) { return x * 2 }`);
  });
});
