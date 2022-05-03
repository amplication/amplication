import { builders, namedTypes } from "ast-types";

export const PUBLIC_ID = builders.identifier("Public");

export function createPublicDecorator(): namedTypes.Decorator {
  return builders.decorator(builders.callExpression(PUBLIC_ID, []));
}
