import DsgContext from "../dsg-context";
import { Entity } from "@amplication/code-gen-types";
import { camelCase } from "camel-case";

export function createEntityToDirectory(
  entities: Entity[]
): Record<string, string> {
  const { clientDirectories } = DsgContext.getInstance;
  return Object.fromEntries(
    entities.map((entity) => [
      entity.name,
      `${clientDirectories.srcDirectory}/${camelCase(entity.name)}`,
    ])
  );
}
