import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import {
  parse,
  transformTemplateLiteralToStringLiteral,
  interpolate,
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
