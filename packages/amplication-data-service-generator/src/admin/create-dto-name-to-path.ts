import { camelCase } from "camel-case";
import { DTOs } from "../resource/create-dtos";
import { SRC_DIRECTORY } from "./constants";

const API_DIRECTORY = `${SRC_DIRECTORY}/api`;

export function createDTONameToPath(dtos: DTOs): Record<string, string> {
  return Object.fromEntries(
    Object.entries(dtos).flatMap(([entityName, entityDTOs]) =>
      Object.values(entityDTOs).map((dto) => [
        dto.id.name,
        `${API_DIRECTORY}/${camelCase(entityName)}/dtos/${dto.id.name}.ts`,
      ])
    )
  );
}
