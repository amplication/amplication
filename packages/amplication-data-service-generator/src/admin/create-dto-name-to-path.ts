import { camelCase } from "camel-case";
import { DTOs } from "../server/resource/create-dtos";
import { API_DIRECTORY } from "./constants";

export function createDTONameToPath(dtos: DTOs): Record<string, string> {
  return Object.fromEntries(
    Object.entries(dtos).flatMap(([entityName, entityDTOs]) =>
      Object.values(entityDTOs).map((dto) => [
        dto.id.name,
        `${API_DIRECTORY}/${camelCase(entityName)}/${dto.id.name}.ts`,
      ])
    )
  );
}
