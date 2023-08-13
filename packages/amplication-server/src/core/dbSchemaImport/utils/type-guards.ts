import { DBSchemaImportMetadata } from "../types";

export function isDBImportMetadata(obj: any): obj is DBSchemaImportMetadata {
  return obj && typeof obj === "object" && "fileName" in obj && "schema" in obj;
}
