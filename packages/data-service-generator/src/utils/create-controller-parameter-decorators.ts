import { builders, namedTypes } from "ast-types";

const PARAM_ID = builders.identifier("common.Param");

export function createControllerParamDecorator(): namedTypes.Decorator {
  return builders.decorator(builders.callExpression(PARAM_ID, []));
}

const BODY_ID = builders.identifier("common.Body");

export function createControllerBodyDecorator(): namedTypes.Decorator {
  return builders.decorator(builders.callExpression(BODY_ID, []));
}

const QUERY_ID = builders.identifier("common.Query");

export function createControllerQueryDecorator(): namedTypes.Decorator {
  return builders.decorator(builders.callExpression(QUERY_ID, []));
}
