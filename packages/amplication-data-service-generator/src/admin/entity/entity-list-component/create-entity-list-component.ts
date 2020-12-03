import * as path from "path";
import { builders } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity } from "../../../types";
import {
  addImports,
  getNamedProperties,
  importNames,
  interpolate,
} from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";
import { DTOs } from "../../../resource/create-dtos";
import { EntityComponent } from "../../types";
import { jsxElement } from "../../util";
import { createFieldValue } from "../create-field-value";

const template = path.resolve(__dirname, "entity-list-component.template.tsx");

const ITEM_ID = builders.identifier("item");

export async function createEntityListComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  dtoNameToPath: Record<string, string>
): Promise<EntityComponent> {
  const file = await readFile(template);
  const name = `${entity.name}List`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  const entityDTO = dtos[entity.name].entity;
  const fieldNameToField = Object.fromEntries(
    entity.fields.map((field) => [field.name, field])
  );
  const entityDTOProperties = getNamedProperties(entityDTO);
  const nonIdProperties = entityDTOProperties.filter(
    (property) => property.key.name !== "id"
  );

  interpolate(file, {
    ENTITY: builders.identifier(entity.name),
    ENTITY_LIST: builders.identifier(name),
    ENTITY_PLURAL_DISPLAY_NAME: builders.stringLiteral(
      entity.pluralDisplayName
    ),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    TITLE_CELLS: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      nonIdProperties.map((property) => {
        const name = property.key.name;
        const field = fieldNameToField[name];
        return jsxElement`<th>${field.displayName}</th>`;
      })
    ),
    CELLS: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      nonIdProperties.map((property) => {
        const field = fieldNameToField[property.key.name];
        return jsxElement`<td>${createFieldValue(field, ITEM_ID)}</td>`;
      })
    ),
  });

  addImports(file, [
    importNames(
      [entityDTO.id],
      relativeImportPath(modulePath, dtoNameToPath[entityDTO.id.name])
    ),
  ]);

  return { name, file, modulePath };
}
