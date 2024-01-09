// Import the formatCode function from your code
import { format } from "prettier";
import { formatCode } from "./files"; // Replace './your-module' with the actual path

describe("formatCode", () => {
  it("should format TypeScript and TypeScriptX files", () => {
    const code = "const x = 42;";
    const path = "example.ts";
    const formattedCode = formatCode(path, code);
    expect(formattedCode).toEqual(format(code, { parser: "typescript" }));
  });

  it("should format JSON files", () => {
    const code = '{"key": "value"}';
    const path = "example.json";
    const formattedCode = formatCode(path, code);
    expect(formattedCode).toEqual(format(code, { parser: "json" }));
  });

  it("should format YAML and YML files", () => {
    const code = "key: value";
    const pathYML = "example.yml";
    const formattedCodeYML = formatCode(pathYML, code);
    expect(formattedCodeYML).toEqual(format(code, { parser: "yaml" }));

    const pathYAML = "example.yaml";
    const formattedCodeYAML = formatCode(pathYAML, code);
    expect(formattedCodeYAML).toEqual(format(code, { parser: "yaml" }));
  });

  it("should format Markdown files", () => {
    const code = "# Heading";
    const path = "example.md";
    const formattedCode = formatCode(path, code);
    expect(formattedCode).toEqual(format(code, { parser: "markdown" }));
  });

  it("should format GraphQL files", () => {
    const code = "type Query { hello: String }";
    const path = "example.graphql";
    const formattedCode = formatCode(path, code);
    expect(formattedCode).toEqual(format(code, { parser: "graphql" }));
  });

  it("should return unformatted code for unsupported file types", () => {
    const code = "const x = 42;";
    const path = "example.js"; // Unsupported file type
    const formattedCode = formatCode(path, code);
    expect(formattedCode).toEqual(code);
  });
});
