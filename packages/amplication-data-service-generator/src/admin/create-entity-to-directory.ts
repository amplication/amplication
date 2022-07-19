import { camelCase } from "camel-case";
import { Entity } from "../types";

export function createEntityToDirectory(
  entities: Entity[],
  srcDirectory: string
): Record<string, string> {
  return Object.fromEntries(
    entities.map((entity) => [
      entity.name,
      `${srcDirectory}/${camelCase(entity.name)}`,
    ])
  );
}
