import { builders } from "ast-types";
import { classDeclaration, NamedClassDeclaration } from "../../../util/ast";
import { INPUT_TYPE_ID } from "./nestjs-graphql.util";

const INPUT_TYPE_DECORATOR = builders.decorator(
  builders.callExpression(INPUT_TYPE_ID, [])
);

export function createInput(dto: NamedClassDeclaration): NamedClassDeclaration {
  return classDeclaration(dto.id, dto.body, dto.superClass, [
    INPUT_TYPE_DECORATOR,
  ]) as NamedClassDeclaration;
}
