import { builders } from "ast-types";
import {
  createTestData,
  convertOpenAPIParametersToType,
  schemaToType,
} from "./open-api-code-generation";
import { importNames } from "./ast";

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

describe("convertOpenAPIParametersToType", () => {
  test("Single parameter, no schema", () => {
    const type = convertOpenAPIParametersToType([
      {
        name: "id",
        in: "path",
      },
    ]);
    expect(type).toEqual(
      builders.tsTypeLiteral([
        builders.tsPropertySignature(
          builders.identifier("id"),
          builders.tsTypeAnnotation(builders.tsStringKeyword())
        ),
      ])
    );
  });
  test("Single parameter, string schema", () => {
    const type = convertOpenAPIParametersToType([
      {
        name: "id",
        in: "path",
        schema: {
          type: "string",
        },
      },
    ]);
    expect(type).toEqual(
      builders.tsTypeLiteral([
        builders.tsPropertySignature(
          builders.identifier("id"),
          builders.tsTypeAnnotation(builders.tsStringKeyword())
        ),
      ])
    );
  });
  test("Single parameter, number schema", () => {
    const type = convertOpenAPIParametersToType([
      {
        name: "id",
        in: "path",
        schema: {
          type: "number",
        },
      },
    ]);
    expect(type).toEqual(
      builders.tsTypeLiteral([
        builders.tsPropertySignature(
          builders.identifier("id"),
          builders.tsTypeAnnotation(builders.tsNumberKeyword())
        ),
      ])
    );
  });
});

describe("schemaToType", () => {
  test("string", () => {
    expect(schemaToType({ type: "string" })).toEqual({
      type: builders.tsStringKeyword(),
      imports: [],
    });
  });
  test("number", () => {
    expect(schemaToType({ type: "number" })).toEqual({
      type: builders.tsNumberKeyword(),
      imports: [],
    });
  });
  test("reference", () => {
    expect(schemaToType({ $ref: "#/components/schemas/foo" })).toEqual({
      type: builders.tsTypeReference(builders.identifier("foo")),
      imports: [importNames([builders.identifier("foo")], "./foo")],
    });
  });
  test("array with reference", () => {
    expect(
      schemaToType({
        type: "array",
        items: { $ref: "#/components/schemas/foo" },
      })
    ).toEqual({
      type: builders.tsArrayType(
        builders.tsTypeReference(builders.identifier("foo"))
      ),
      imports: [importNames([builders.identifier("foo")], "./foo")],
    });
  });
});
