import { createTestData } from "./test-data";
import { builders } from "ast-types";

const EMPTY_OPEN_API_OBJECT = {
  openapi: "3",
  info: {
    title: "Empty OpenAPI Object",
    version: "1.0.0",
  },
  paths: {},
};

describe("createTestData", () => {
  test("string", () => {
    const result = createTestData(EMPTY_OPEN_API_OBJECT, { type: "string" });
    expect(result).toEqual(builders.stringLiteral("Example string"));
  });
  test("string, email format", () => {
    const result = createTestData(EMPTY_OPEN_API_OBJECT, {
      type: "string",
      format: "email",
    });
    expect(result).toEqual(builders.stringLiteral("alice@example.com"));
  });
  test("object with properties", () => {
    const result = createTestData(EMPTY_OPEN_API_OBJECT, {
      type: "object",
      properties: { foo: { type: "string" } },
    });
    expect(result).toEqual(
      builders.objectExpression([
        builders.objectProperty(
          builders.identifier("foo"),
          builders.stringLiteral("Example foo")
        ),
      ])
    );
  });
  test("object with no properties", () => {
    const result = createTestData(EMPTY_OPEN_API_OBJECT, { type: "object" });
    expect(result).toEqual(builders.objectExpression([]));
  });
  test("number", () => {
    const result = createTestData(EMPTY_OPEN_API_OBJECT, { type: "number" });
    expect(result).toEqual(builders.numericLiteral(42));
  });
  test("array with items", () => {
    const result = createTestData(EMPTY_OPEN_API_OBJECT, {
      type: "array",
      items: { type: "string" },
    });
    expect(result).toEqual(
      builders.arrayExpression([builders.stringLiteral("Example string")])
    );
  });
  test("array with no items", () => {
    const result = createTestData(EMPTY_OPEN_API_OBJECT, { type: "array" });
    expect(result).toEqual(builders.arrayExpression([]));
  });
});
