import { builders } from "ast-types";
import { createTestData } from "./open-api-code-generation";

describe("createTestData", () => {
  test("string", () => {
    const result = createTestData({ type: "string" });
    expect(result).toEqual(builders.stringLiteral("Example string"));
  });
  test("object with properties", () => {
    const result = createTestData({
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
    const result = createTestData({ type: "object" });
    expect(result).toEqual(builders.objectExpression([]));
  });
  test("number", () => {
    const result = createTestData({ type: "number" });
    expect(result).toEqual(builders.numericLiteral(42));
  });
  test("array with items", () => {
    const result = createTestData({ type: "array", items: { type: "string" } });
    expect(result).toEqual(
      builders.arrayExpression([builders.stringLiteral("Example string")])
    );
  });
  test("array with no items", () => {
    const result = createTestData({ type: "array" });
    expect(result).toEqual(builders.arrayExpression([]));
  });
});
