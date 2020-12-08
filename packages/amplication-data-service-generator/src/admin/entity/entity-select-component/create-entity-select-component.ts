import * as path from "path";
import { builders } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity } from "../../../types";
import { addImports, importNames, interpolate } from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";
import { DTOs } from "../../../server/resource/create-dtos";
import { EntityComponent } from "../../types";

const template = path.resolve(
  __dirname,
  "entity-select-component.template.tsx"
);

export async function createEntitySelectComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  dtoNameToPath: Record<string, string>
): Promise<EntityComponent> {
  const file = await readFile(template);
  const name = `${entity.name}Select`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  const entityDTO = dtos[entity.name].entity;

  interpolate(file, {
    ENTITY: builders.identifier(entity.name),
    ENTITY_SELECT: builders.identifier(name),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
  });

  addImports(file, [
    importNames(
      [entityDTO.id],
      relativeImportPath(modulePath, dtoNameToPath[entityDTO.id.name])
    ),
  ]);

  return { name, file, modulePath };
}
