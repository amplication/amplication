import { camelCase } from "camel-case";
import { Entity } from "../types";
import { SRC_DIRECTORY } from "./constants";

export function createEntityToDirectory(
  entities: Entity[]
): Record<string, string> {
  return Object.fromEntries(
    entities.map((entity) => [
      entity.name,
      `${SRC_DIRECTORY}/${camelCase(entity.name)}`,
    ])
  );
}
