import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import {
  parse,
  transformTemplateLiteralToStringLiteral,
  interpolate,
  findCallExpressionByCalleeId,
  findCallExpressionsByCalleeId,
  jsonToExpression,
  removeTSInterfaceDeclares,
} from "./ast";

describe("interpolate", () => {
  test("Evaluate template literal", () => {
    const mapping = {
      NAME: builders.stringLiteral("World"),
    };
    const file = parse("`Hello, ${NAME}!`");
    interpolate(file, mapping);
    const { code } = print(file);
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
    const file = parse(`foo()`);
    const expression = findCallExpressionByCalleeId(
      file,
      builders.identifier("foo")
    );
    expect(expression).toBeDefined();
  });
  test("Doesn't find a non existing call", () => {
    const file = parse(`foo()`);
    const expression = findCallExpressionByCalleeId(
      file,
      builders.identifier("bar")
    );
    expect(expression).toBeUndefined();
  });
});

describe("findCallExpressionsByCalleeId", () => {
  const id = builders.identifier("foo");
  const nonExistingId = builders.identifier("bar");
  test("Finds a call at the top level", () => {
    const file = parse(`foo()`);
    const expressions = findCallExpressionsByCalleeId(file, id);
    expect(expressions.length).toBe(1);
  });
  test("Finds two calls at the top level", () => {
    const file = parse(`foo(); foo()`);
    const expressions = findCallExpressionsByCalleeId(file, id);
    expect(expressions.length).toBe(2);
  });
  test("Doesn't find a non existing call", () => {
    const file = parse(`foo()`);
    const expressions = findCallExpressionsByCalleeId(file, nonExistingId);
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

describe("removeTSInterfaceDeclares", () => {
  const file = parse(`declare interface A {}; interface B {}`);
  removeTSInterfaceDeclares(file);
  expect(print(file).code).toEqual(`interface B {}`);
});
