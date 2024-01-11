import { typedExpression } from "../utils/ast";
import { namedTypes } from "ast-types";

export const jsxElement = typedExpression(namedTypes.JSXElement);
export const jsxFragment = typedExpression(namedTypes.JSXFragment);
