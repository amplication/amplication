import { ASTNode } from "ast-types";
import { visit } from "recast";

/**
 * Removes all TypeScript class declares
 * @param ast the AST to remove the declares from
 */
export function removeTSClassDeclares(ast: ASTNode): void {
  visit(ast, {
    visitClassDeclaration(path) {
      if (path.get("declare").value) {
        path.prune();
      }
      this.traverse(path);
    },
  });
}
