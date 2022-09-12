import { camelCase } from "camel-case";
import { DTOs } from "@amplication/code-gen-types";

export function createDTONameToPath(
  dtos: DTOs,
  apiDirectory: string
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(dtos).flatMap(([entityName, entityDTOs]) =>
      Object.values(entityDTOs).map((dto) => [
        dto.id.name,
        `${apiDirectory}/${camelCase(entityName)}/${dto.id.name}.ts`,
      ])
    )
  );
}
