import { OpenAPIObject } from "openapi3-ts";
import get from "lodash.get";

/** @todo consolidate with the other resolveRef implementation */
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
