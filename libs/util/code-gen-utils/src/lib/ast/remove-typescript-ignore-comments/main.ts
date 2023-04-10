import { ASTNode } from "ast-types";
import { visit } from "recast";

const TS_IGNORE_TEXT = "@ts-ignore";

/**
 * Removes all TypeScript ignore comments
 * @param ast the AST to remove the comments from
 */
export function removeTSIgnoreComments(ast: ASTNode): void {
  visit(ast, {
    visitComment(path) {
      if (path.value.value.includes(TS_IGNORE_TEXT)) {
        path.prune();
      }
      this.traverse(path);
    },
  });
}
