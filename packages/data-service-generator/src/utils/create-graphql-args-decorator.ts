import { builders, namedTypes } from "ast-types";

const ARGS_ID = builders.identifier("graphql.Args");

export function createGraphqlArgsDecorator(
  hasArgument = false
): namedTypes.Decorator {
  const args = hasArgument ? [builders.stringLiteral("args")] : [];
  return builders.decorator(builders.callExpression(ARGS_ID, args));
}
