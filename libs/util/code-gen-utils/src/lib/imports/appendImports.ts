import { namedTypes } from "ast-types";

/**
 * This function will append an import to the imports of a AST source file by searching for the last import and inserting the new import after it.
 * This file mutate the file ast object.
 */
export function appendImports(
  file: namedTypes.File,
  imports: namedTypes.ImportDeclaration[]
): namedTypes.File {
  const {
    program: { body },
  } = file;

  let locationOfLastImport = 0;
  body.forEach((node, i) => {
    if (node.type === "ImportDeclaration") {
      locationOfLastImport = i;
    }
  });

  const newImportLocation =
    locationOfLastImport === 0 ? 0 : locationOfLastImport + 1;
  body.splice(newImportLocation, 0, ...imports);
  return file;
}
