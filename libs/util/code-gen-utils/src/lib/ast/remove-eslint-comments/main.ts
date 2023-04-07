import { ASTNode, namedTypes } from "ast-types";
import { visit } from "recast";

/**
 * Removes all ESLint comments
 * @param ast the AST to remove the comments from
 */
export function removeESLintComments(ast: ASTNode): void {
  visit(ast, {
    visitComment(path) {
      const comment = path.value as namedTypes.Comment;
      if (comment.value.match(/^\s+eslint-disable/)) {
        path.prune();
      }
      this.traverse(path);
    },
  });
}
