import {
  OpenAPIObject,
  PathsObject,
  ContentObject,
  OperationObject,
  ResponseObject,
  ParameterObject,
  ReferenceObject,
  SchemaObject,
  isReferenceObject,
} from "openapi3-ts";
import get from "lodash.get";

export const STATUS_OK = "200";
export const STATUS_CREATED = "201";
export const JSON_MIME = "application/json";
const SCHEMA_PREFIX = "#/components/schemas/";

export function removeSchemaPrefix(ref: string): string {
  return ref.replace(SCHEMA_PREFIX, "");
}

export type GroupedResourcePathsObject = { [resource: string]: PathsObject };

export function groupByResource(
  api: OpenAPIObject
): GroupedResourcePathsObject {
  const resources: GroupedResourcePathsObject = {};
  for (const [path, pathSpec] of Object.entries(api.paths)) {
    /** @todo handle deep paths */
    const parts = path.split("/");
    const [, resourcePart] = parts;
    resources[resourcePart] = resources[resourcePart] || {};
    resources[resourcePart][path] = pathSpec;
  }
  return resources;
}

export enum HTTPMethod {
  get = "get",
  post = "post",
  patch = "patch",
  put = "put",
  delete = "delete",
}

// Copied from https://github.com/isa-group/oas-tools/blob/5ee4506e4020671a11412d8d549da3e01c44c143/src/index.js
export function getExpressVersion(oasPath: string): string {
  return oasPath.replace(/{/g, ":").replace(/}/g, "");
}

export function getResponseContentSchema(
  operation: OperationObject,
  code: string,
  contentType: string
): ReferenceObject | SchemaObject {
  if (!operation.responses) {
    throw new Error("operation.responses must be defined");
  }
  if (!(code in operation.responses)) {
    throw new Error(`No response is defined for code ${code}`);
  }
  const response = operation.responses[code] as ResponseObject;

  if (!response.content) {
    throw new Error("Operation response has no content");
  }

  if (!(contentType in response.content)) {
    throw new Error(
      `No operation response content is defined for ${contentType}`
    );
  }

  const content = response.content[contentType];

  if (!("schema" in content) || !content.schema) {
    throw new Error(
      `Schema is not defined for ${contentType} operation response content`
    );
  }

  return content.schema;
}

export function getContentSchema(
  content: ContentObject,
  contentType: string
): SchemaObject {
  const mediaType = content[contentType];
  if (!mediaType.schema) {
    throw new Error("mediaType.schema must be defined");
  }
  return mediaType.schema;
}

export function getRequestBodySchema(
  api: OpenAPIObject,
  operation: OperationObject,
  contentType: string
): SchemaObject {
  const schema = get(operation, [
    "requestBody",
    "content",
    contentType,
    "schema",
  ]);
  if (!schema) {
    throw new Error(
      `Operation must have requestBody.content['${contentType}'].schema defined`
    );
  }
  return schema;
}

export function getOperations(
  paths: PathsObject
): Array<{
  path: string;
  httpMethod: HTTPMethod;
  operation: OperationObject;
}> {
  return Object.entries(paths).flatMap(([path, pathSpec]) =>
    Object.entries(pathSpec).flatMap(([httpMethod, operation]) => ({
      path,
      httpMethod: httpMethod as HTTPMethod,
      operation: operation as OperationObject,
    }))
  );
}

export function getParameters(
  api: OpenAPIObject,
  operation: OperationObject
): ParameterObject[] {
  const { parameters = [] } = operation;
  return !parameters
    ? []
    : parameters.map((parameter) => dereference(api, parameter));
}

export function dereference<T>(api: OpenAPIObject, value: ReferenceObject | T) {
  // @ts-ignore
  if (typeof value === "object" && value && isReferenceObject(value)) {
    return resolveRef(api, value.$ref) as T;
  }
  return value;
}

function resolveRef(api: OpenAPIObject, ref: string): Object {
  const parts = ref.split("/");
  const [firstPart, ...rest] = parts;
  if (firstPart !== "#") {
    throw new Error("Not implemented for references not starting with #/");
  }
  const value = get(api, rest);
  if (!value) {
    throw new Error(`Invalid ref: ${ref}`);
  }
  return value;
}
