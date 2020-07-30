import { builders } from "ast-types";
import {
  convertOpenAPIParametersToType,
  schemaToType,
  getDTOPath,
} from "./open-api-code-generation";
import { removeExt } from "./module";
import { importNames } from "./ast";

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
  const objectName = "foo";
  const objectSchemaRef = `#/components/schemas/${objectName}`;
  const objectId = builders.identifier(objectName);
  const objectDTOImportPath = removeExt(getDTOPath(objectName));
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
    expect(schemaToType({ $ref: objectSchemaRef })).toEqual({
      type: builders.tsTypeReference(objectId),
      imports: [importNames([objectId], objectDTOImportPath)],
    });
  });
  test("array with reference", () => {
    expect(
      schemaToType({
        type: "array",
        items: { $ref: objectSchemaRef },
      })
    ).toEqual({
      type: builders.tsArrayType(builders.tsTypeReference(objectId)),
      imports: [importNames([objectId], objectDTOImportPath)],
    });
  });
});
