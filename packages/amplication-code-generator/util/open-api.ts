import {
  OpenAPIObject,
  PathsObject,
  ContentObject,
  OperationObject,
  ResponseObject,
} from "openapi3-ts";
import get from "lodash.get";

const SCHEMA_PREFIX = "#/components/schemas/";

export function prefixSchema(name: string): string {
  return SCHEMA_PREFIX + name;
}

export function removeSchemaPrefix(ref: string): string {
  return ref.replace(SCHEMA_PREFIX, "");
}

export function resolveRef(api: OpenAPIObject, ref: string): Object {
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

export function getResponseContentSchemaRef(
  operation: OperationObject,
  code: string,
  contentType: string
): string {
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
      "Schema is not defined for JSON operation response content"
    );
  }

  return content.schema["$ref"];
}

export function getContentSchemaRef(content: ContentObject): string {
  const mediaType = content["application/json"];
  if (!mediaType.schema) {
    throw new Error("mediaType.schema must be defined");
  }
  return mediaType.schema["$ref"];
}
