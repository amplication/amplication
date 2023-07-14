import { DBImportMetadata } from "../types";

export function isDBImportMetadata(obj: any): obj is DBImportMetadata {
  return obj && typeof obj === "object" && "fileName" in obj && "schema" in obj;
}
