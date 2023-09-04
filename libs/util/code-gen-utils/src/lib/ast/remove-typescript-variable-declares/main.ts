import { ASTNode } from "ast-types";
import { visit } from "recast";

/**
 * Removes all TypeScript variable declares
 * @param ast the AST to remove the declares from
 */
export function removeTSVariableDeclares(ast: ASTNode): void {
  visit(ast, {
    visitVariableDeclaration(path) {
      if (path.get("declare").value) {
        path.prune();
      }
      this.traverse(path);
    },
  });
}
