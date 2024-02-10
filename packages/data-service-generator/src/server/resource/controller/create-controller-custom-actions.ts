import { ModuleAction } from "@amplication/code-gen-types";
import { namedTypes } from "ast-types";
import { generateBaseCustomActionMethod } from "../resolver/create-resolver-custom-actions";
import {
  createRestApiResponseTypeDecorator,
  createRestApiVerbDecorator,
  createStaticDecorators,
} from "./create-rest-api-decorator";

export function createControllerCustomActionMethods(
  actions: ModuleAction[]
): namedTypes.ClassMethod[] {
  if (!actions || actions.length === 0) {
    return [];
  }

  const methods = actions.map((action) => {
    return generateRestApiControllerMethod(action);
  });

  return methods;
}

function generateRestApiControllerMethod(
  action: ModuleAction
): namedTypes.ClassMethod {
  const method = generateBaseCustomActionMethod(action);

  method.decorators = [
    createRestApiVerbDecorator(action),
    createRestApiResponseTypeDecorator(action),
    ...createStaticDecorators(),
  ];

  return method;
}