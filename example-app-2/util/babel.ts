import * as t from "@babel/types";

export type NamedFunctionDeclaration = t.FunctionDeclaration & {
  id: t.Identifier;
};

export function transformFunctionToClassMethod(
  declaration: NamedFunctionDeclaration
): t.ClassMethod {
  const method = t.classMethod(
    "method",
    declaration.id,
    declaration.params,
    declaration.body
  );
  method.returnType = declaration.returnType;
  return method;
}
