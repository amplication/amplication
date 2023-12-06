import {
  EnumModuleActionType,
  ModuleAction,
} from "@amplication/code-gen-types";
import { ASTNode, namedTypes } from "ast-types";
import { visit } from "recast";

export function removeCallExpressionStatementByName(
  ast: ASTNode,
  action: ModuleAction
): void {
  visit(ast, {
    visitCallExpression(path) {
      const expression = path.value as namedTypes.CallExpression;
      const { actionType, name } = action;
      const argument = expression.arguments.find(
        (a) => a.type === "StringLiteral"
      ) as namedTypes.StringLiteral;

      if (!argument) return this.traverse(path);

      if (
        actionType === EnumModuleActionType.Create &&
        argument.value.includes("POST")
      ) {
        path.prune();
      }

      if (
        actionType === EnumModuleActionType.Find &&
        argument.value === `GET /${name}`
      ) {
        path.prune();
      }

      if (
        actionType === EnumModuleActionType.Read &&
        argument.value.includes(":id")
      ) {
        path.prune();
      }

      this.traverse(path);
    },
  });
}

export function removeObjectMethodByName(
  ast: ASTNode,
  actionName: string
): void {
  visit(ast, {
    visitObjectMethod(path) {
      const keyName = path.value.key.name;
      if (keyName === actionName) {
        path.prune();
      }

      this.traverse(path);
    },
  });
}

export function removeObjectPropertyByName(
  ast: ASTNode,
  actionName: string
): void {
  visit(ast, {
    visitObjectProperty(path) {
      const keyName = path.value.key.name;
      if (keyName === actionName) {
        path.prune();
      }

      this.traverse(path);
    },
  });
}
