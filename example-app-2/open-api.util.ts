import { OpenAPIObject, PathsObject } from "openapi3-ts";
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
  return get(api, rest);
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
