import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import {
  parse,
  transformTemplateLiteralToStringLiteral,
  interpolateAST,
  findCallExpressionByCalleeId,
  findCallExpressionsByCalleeId,
  jsonToExpression,
} from "./ast";

describe("interpolateAST", () => {
  test("Evaluate template literal", () => {
    const mapping = {
      NAME: builders.stringLiteral("World"),
    };
    const ast = parse("`Hello, ${NAME}!`");
    interpolateAST(ast, mapping);
    const { code } = print(ast);
    expect(code).toBe('"Hello, World!"');
  });
});

describe("transformTemplateLiteralToStringLiteral", () => {
  test("Quasis only", () => {
    const quasis = [
      builders.templateElement({ cooked: "Hello", raw: "Hello" }, true),
    ];
    const expressions = [] as namedTypes.StringLiteral[];
    const templateLiteral = builders.templateLiteral(quasis, expressions);
    const stringLiteral = transformTemplateLiteralToStringLiteral(
      templateLiteral
    );
    expect(stringLiteral.value).toBe("Hello");
  });
  test("Single qusie and string literal", () => {
    const quasis = [
      builders.templateElement({ cooked: "Hello, ", raw: "Hello, " }, true),
    ];
    const expressions = [builders.stringLiteral("World")];
    const templateLiteral = builders.templateLiteral(quasis, expressions);
    const stringLiteral = transformTemplateLiteralToStringLiteral(
      templateLiteral
    );
    expect(stringLiteral.value).toBe("Hello, World");
  });
  test("Two quasis and string literal", () => {
    const quasis = [
      builders.templateElement({ cooked: "Hello, ", raw: "Hello, " }, false),
      builders.templateElement({ cooked: "!", raw: "!" }, true),
    ];
    const expressions = [builders.stringLiteral("World")];
    const templateLiteral = builders.templateLiteral(quasis, expressions);
    const stringLiteral = transformTemplateLiteralToStringLiteral(
      templateLiteral
    );
    expect(stringLiteral.value).toBe("Hello, World!");
  });
});

describe("findCallExpressionByCalleeId", () => {
  test("Finds a call at the top level", () => {
    const ast = parse(`foo()`);
    const expression = findCallExpressionByCalleeId(ast, "foo");
    expect(expression).toBeDefined();
  });
  test("Doesn't find a non existing call", () => {
    const ast = parse(`foo()`);
    const expression = findCallExpressionByCalleeId(ast, "bar");
    expect(expression).toBeUndefined();
  });
});

describe("findCallExpressionsByCalleeId", () => {
  test("Finds a call at the top level", () => {
    const ast = parse(`foo()`);
    const expressions = findCallExpressionsByCalleeId(ast, "foo");
    expect(expressions.length).toBe(1);
  });
  test("Finds two calls at the top level", () => {
    const ast = parse(`foo(); foo()`);
    const expressions = findCallExpressionsByCalleeId(ast, "foo");
    expect(expressions.length).toBe(2);
  });
  test("Doesn't find a non existing call", () => {
    const ast = parse(`foo()`);
    const expressions = findCallExpressionsByCalleeId(ast, "bar");
    expect(expressions.length).toBe(0);
  });
});

describe("jsonToExpression", () => {
  const cases = [{}, [], 42, "Hello, World!", { a: "b" }, [{ a: "b" }]];
  test.each(cases)(".jsonToExpression(%v)", (value) => {
    const json = JSON.stringify(value);
    expect(print(jsonToExpression(JSON.parse(json))).code).toEqual(json);
  });
});
