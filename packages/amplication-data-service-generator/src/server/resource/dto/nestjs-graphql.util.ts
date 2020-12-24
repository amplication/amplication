import { builders, namedTypes } from "ast-types";
import { ClassDeclaration } from "../../../util/ast";

export const NESTJS_GRAPHQL_MODULE = "@nestjs/graphql";
export const OBJECT_TYPE_ID = builders.identifier("ObjectType");
export const INPUT_TYPE_ID = builders.identifier("InputType");
export const ARGS_TYPE_ID = builders.identifier("ArgsType");
export const FIELD_ID = builders.identifier("Field");

export function isInputType(classDeclaration: ClassDeclaration): boolean {
  return (
    classDeclaration.decorators &&
    classDeclaration.decorators.some(
      (decorator) =>
        namedTypes.CallExpression.check(decorator.expression) &&
        namedTypes.Identifier.check(decorator.expression.callee) &&
        decorator.expression.callee.name === INPUT_TYPE_ID.name
    )
  );
}
