import { appendImports } from "./appendImports";
import { types } from "recast";
import { namedTypes } from "ast-types/gen/namedTypes";
import { print } from "../files";
const { builders } = types;
const {
  importDeclaration,
  program,
  variableDeclaration,
  stringLiteral,
  importSpecifier,
  identifier,
} = builders;
describe("Testing the functionality of append imports", () => {
  it("should append the imports to the end of the imports section of a typescript file", () => {
    // ARRANGE
    const file: namedTypes.File = builders.file(
      program([
        importDeclaration(
          [importSpecifier(identifier("first"))],
          stringLiteral("import")
        ),
        importDeclaration(
          [importSpecifier(identifier("second"))],
          stringLiteral("import")
        ),
        variableDeclaration("const", [
          builders.variableDeclarator(
            builders.identifier("a"),
            builders.literal(1)
          ),
        ]),
      ])
    );

    // ACT
    appendImports(file, [
      importDeclaration(
        [importSpecifier(identifier("ofek"))],
        stringLiteral("test")
      ),
    ]);
    const code = print(file).code;

    // ASSERT
    expect(code).toBe(
      `import { first } from "import";
import { second } from "import";
import { ofek } from "test";
const a = 1;`
    );
  });
  it("should put the import in the start of the file if there are no imports", () => {
    // ARRANGE
    const file: namedTypes.File = builders.file(
      program([
        variableDeclaration("const", [
          builders.variableDeclarator(
            builders.identifier("a"),
            builders.literal(1)
          ),
        ]),
      ])
    );

    // ACT
    appendImports(file, [
      importDeclaration(
        [importSpecifier(identifier("ofek"))],
        stringLiteral("test")
      ),
    ]);
    const code = print(file).code;

    // ASSERT
    expect(code).toBe(
      `import { ofek } from "test";
const a = 1;`
    );
  });
});
