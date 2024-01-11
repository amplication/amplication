import { print } from "@amplication/code-gen-utils";
import { ASTNode } from "ast-types";
import { format } from "prettier";
export function printTypescript(ast: ASTNode): string {
  return format(print(ast).code, { parser: "typescript" });
}
