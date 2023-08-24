import { builders, namedTypes } from "ast-types";
import { ClassDeclaration } from "@amplication/code-gen-types";

export const NESTJS_GRAPHQL_MODULE = "@nestjs/graphql";
export const OBJECT_TYPE_ID = builders.identifier("ObjectType");
export const INPUT_TYPE_ID = builders.identifier("InputType");
export const ARGS_TYPE_ID = builders.identifier("ArgsType");
export const FIELD_ID = builders.identifier("Field");
export const FLOAT_ID = builders.identifier("Float");
export const INT_ID = builders.identifier("Int");

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

export const INPUT_TYPE_DECORATOR = builders.decorator(
  builders.callExpression(INPUT_TYPE_ID, [])
);
