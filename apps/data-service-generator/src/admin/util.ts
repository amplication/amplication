import { namedTypes } from "ast-types";
import { typedExpression } from "../util/ast";

export const jsxElement = typedExpression(namedTypes.JSXElement);
export const jsxFragment = typedExpression(namedTypes.JSXFragment);
