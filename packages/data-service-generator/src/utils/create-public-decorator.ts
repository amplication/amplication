import { builders, namedTypes } from "ast-types";

export const PUBLIC_DECORATOR_NAME = "Public";
export const PUBLIC_ID = builders.identifier(PUBLIC_DECORATOR_NAME);

export function createPublicDecorator(): namedTypes.Decorator {
  return builders.decorator(builders.callExpression(PUBLIC_ID, []));
}
