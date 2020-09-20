import { Entity } from "../types";

export function getEntityIdToName(entities: Entity[]): Record<string, string> {
  return Object.fromEntries(entities.map((entity) => [entity.id, entity.name]));
}
