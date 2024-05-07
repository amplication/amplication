import { removeTSIgnoreComments } from "../";
import { namedTypes } from "ast-types";

/**
 * Like removeTSIgnoreComments but removes TypeScript ignore comments from
 * imports only
 * @param file file to remove comments from
 */
export function removeImportsTSIgnoreComments(file: namedTypes.File): void {
  for (const statement of file.program.body) {
    if (!namedTypes.ImportDeclaration.check(statement)) {
      break;
    }
    removeTSIgnoreComments(statement);
  }
}
