import { ModuleAction } from "@amplication/code-gen-types";
import { namedTypes } from "ast-types";
import { generateBaseCustomActionMethod } from "../resolver/create-resolver-custom-actions";
import { createRestApiResponseTypeDecorator } from "./create-rest-api-decorator";

export function createControllerCustomActionMethods(
  actions: ModuleAction[]
): namedTypes.ClassMethod[] {
  if (!actions || actions.length === 0) {
    return [];
  }

  const methods = actions.map((action) => {
    return generateGraphQLResolverMethod(action);
  });

  return methods;
}

function generateGraphQLResolverMethod(
  action: ModuleAction
): namedTypes.ClassMethod {
  const method = generateBaseCustomActionMethod(action);

  // Add decorators for GraphQL operation
  const restApiResponseTypeDecorator =
    createRestApiResponseTypeDecorator(action);

  method.decorators = [restApiResponseTypeDecorator];

  return method;
}
