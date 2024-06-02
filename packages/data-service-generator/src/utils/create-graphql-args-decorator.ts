import { builders, namedTypes } from "ast-types";

const ARGS_ID = builders.identifier("graphql.Args");

export function createGraphqlArgsDecorator(): namedTypes.Decorator {
  return builders.decorator(builders.callExpression(ARGS_ID, []));
}
