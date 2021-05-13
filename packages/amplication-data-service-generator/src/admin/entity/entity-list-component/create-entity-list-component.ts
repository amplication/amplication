import * as path from "path";
import { builders } from "ast-types";
import { Entity, EnumDataType, LookupResolvedProperties } from "../../../types";
import {
  addImports,
  getNamedProperties,
  importContainedIdentifiers,
  importNames,
  interpolate,
} from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";
import { DTOs } from "../../../server/resource/create-dtos";
import { EntityComponent } from "../../types";
import { jsxElement, jsxFragment } from "../../util";
import { createFieldValue } from "../create-field-value";

const template = path.resolve(__dirname, "entity-list-component.template.tsx");

const ITEM_ID = builders.identifier("item");
const IMPORTABLE_IDS = {
  "@amplication/design-system": [
    builders.identifier("TimeSince"),
    builders.identifier("CircleIcon"),
    builders.identifier("EnumCircleIconStyle"),
  ],
};

export async function createEntityListComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  entityToPath: Record<string, string>,
  entityToResource: Record<string, string>,
  dtoNameToPath: Record<string, string>,
  entityToTitleComponent: Record<string, EntityComponent>
): Promise<EntityComponent> {
  const file = await readFile(template);
  const name = `${entity.name}List`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  const entityDTO = dtos[entity.name].entity;
  const fieldNameToField = Object.fromEntries(
    entity.fields.map((field) => [field.name, field])
  );
  const entityDTOProperties = getNamedProperties(entityDTO);
  const fields = entityDTOProperties.map(
    (property) => fieldNameToField[property.key.name]
  );

  interpolate(file, {
    ENTITY_LIST: builders.identifier(name),
    ENTITY_PLURAL_DISPLAY_NAME: builders.stringLiteral(
      entity.pluralDisplayName
    ),
    CELLS: jsxFragment`<>${fields.map(
      (field) =>
        jsxElement`${createFieldValue(field, ITEM_ID, entityToTitleComponent)}`
    )}</>`,
  });

  addImports(file, [...importContainedIdentifiers(file, IMPORTABLE_IDS)]);

  return { name, file, modulePath };
}
