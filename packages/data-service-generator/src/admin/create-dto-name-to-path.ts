import DsgContext from "../dsg-context";
import { DTOs } from "@amplication/code-gen-types";
import { camelCase } from "camel-case";

export function createDTONameToPath(dtos: DTOs): Record<string, string> {
  const { clientDirectories } = DsgContext.getInstance;
  return Object.fromEntries(
    Object.entries(dtos).flatMap(([entityName, entityDTOs]) =>
      Object.values(entityDTOs).map((dto) => [
        dto.id.name,
        `${clientDirectories.apiDirectory}/${camelCase(entityName)}/${
          dto.id.name
        }.ts`,
      ])
    )
  );
}
