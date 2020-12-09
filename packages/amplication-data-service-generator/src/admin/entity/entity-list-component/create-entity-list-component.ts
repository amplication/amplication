import * as path from "path";
import { builders } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity, EnumDataType, EntityField } from "../../../types";
import {
  addImports,
  getNamedProperties,
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

export async function createEntityListComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  dtoNameToPath: Record<string, string>,
  entityIdToName: Record<string, string>,
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
  const nonIdProperties = entityDTOProperties.filter(
    (property) => property.key.name !== "id"
  );
  const relationFields: EntityField[] = entity.fields.filter(
    (field) => field.dataType === EnumDataType.Lookup
  );

  interpolate(file, {
    ENTITY: builders.identifier(entity.name),
    ENTITY_LIST: builders.identifier(name),
    ENTITY_PLURAL_DISPLAY_NAME: builders.stringLiteral(
      entity.pluralDisplayName
    ),
    ENTITY_DISPLAY_NAME: builders.stringLiteral(entity.displayName),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    FIELDS: builders.arrayExpression(
      entityDTOProperties.map((property) => {
        const name = property.key.name;
        const field = fieldNameToField[name];
        return builders.objectExpression([
          builders.property(
            "init",
            builders.identifier("name"),
            builders.stringLiteral(field.name)
          ),
          builders.property(
            "init",
            builders.identifier("title"),
            builders.stringLiteral(field.displayName)
          ),
          builders.property(
            "init",
            builders.identifier("sortable"),
            builders.booleanLiteral(false)
          ),
        ]);
      })
    ),
    CELLS: jsxFragment`<>${nonIdProperties.map((property) => {
      const field = fieldNameToField[property.key.name];
      return jsxElement`<DataGridCell>${createFieldValue(
        field,
        ITEM_ID,
        entityIdToName,
        entityToTitleComponent
      )}</DataGridCell>`;
    })}</>`,
  });

  // Add imports for entities select components
  addImports(
    file,
    relationFields.map((field) => {
      const relatedEntityName =
        entityIdToName[field.properties.relatedEntityId];
      const relatedEntitySelectComponent =
        entityToTitleComponent[relatedEntityName];
      return importNames(
        [builders.identifier(relatedEntitySelectComponent.name)],
        relativeImportPath(modulePath, relatedEntitySelectComponent.modulePath)
      );
    })
  );

  addImports(file, [
    importNames(
      [entityDTO.id],
      relativeImportPath(modulePath, dtoNameToPath[entityDTO.id.name])
    ),
  ]);

  return { name, file, modulePath };
}
