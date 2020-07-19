import { OperationObject, ParameterObject } from "openapi3-ts";
import { namedTypes, builders } from "ast-types";

/**
 * Creates the params type for nest's controller Params decorated argument.
 * @param operation the OpenAPI Operation of the path parameters to use
 * @returns the new TypeScript object type as AST node
 */
export function createParamsType(
  operation: OperationObject
): namedTypes.TSTypeLiteral {
  if (!operation.parameters) {
    throw new Error("operation.parameters must be defined");
  }
  const pathParameters = operation.parameters.filter(
    (parameter): parameter is ParameterObject =>
      "in" in parameter && parameter.in === "path"
  );
  return convertOpenAPIParametersToType(pathParameters);
}

/**
 * Creates the query type for nest's controller Query decorated argument.
 * @param operation the OpenAPI Operation of the query parameters to use
 * @returns the new TypeScript object type as AST node
 */
export function createQueryType(
  operation: OperationObject
): namedTypes.TSTypeLiteral {
  if (!operation.parameters) {
    throw new Error("operation.parameters must be defined");
  }
  const queryParameters = operation.parameters.filter(
    (parameter): parameter is ParameterObject =>
      "in" in parameter && parameter.in === "query"
  );
  return convertOpenAPIParametersToType(queryParameters);
}

/**
 * Creates an object type from given parameters
 * @param parameters OpenAPI Operation parameters to use as the object fields
 * @returns the new TypeScript object type as AST node
 */
function convertOpenAPIParametersToType(
  parameters: ParameterObject[]
): namedTypes.TSTypeLiteral {
  const paramsPropertySignatures = parameters.map((parameter) =>
    builders.tsPropertySignature(
      builders.identifier(parameter.name),
      /** @todo get type from swagger */
      builders.tsTypeAnnotation(builders.tsStringKeyword())
    )
  );
  return builders.tsTypeLiteral(paramsPropertySignatures);
}
