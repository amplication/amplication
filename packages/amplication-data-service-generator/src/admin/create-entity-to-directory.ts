import { camelCase } from "camel-case";
import { Entity } from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";

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
