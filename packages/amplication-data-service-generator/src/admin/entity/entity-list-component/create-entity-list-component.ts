import * as path from "path";
import { builders } from "ast-types";
import {
  Entity,
  EnumDataType,
  EntityField,
  LookupResolvedProperties,
} from "../../../types";
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
  const path = entityToPath[entity.name];
  const resource = entityToResource[entity.name];
  const entityDTO = dtos[entity.name].entity;
  const fieldNameToField = Object.fromEntries(
    entity.fields.map((field) => [field.name, field])
  );
  const entityDTOProperties = getNamedProperties(entityDTO);
  const fields = entityDTOProperties.map(
    (property) => fieldNameToField[property.key.name]
  );
  const nonIdFields = fields.filter(
    (field) => field.dataType !== EnumDataType.Id
  );
  const idField = fields.find(
    (field) => field.dataType === EnumDataType.Id
  ) as EntityField;
  const relationFields = nonIdFields.filter(
    (field) => field.dataType === EnumDataType.Lookup
  );

  interpolate(file, {
    ENTITY: builders.identifier(entity.name),
    ENTITY_LIST: builders.identifier(name),
    ENTITY_PLURAL_DISPLAY_NAME: builders.stringLiteral(
      entity.pluralDisplayName
    ),
    ENTITY_DISPLAY_NAME: builders.stringLiteral(entity.displayName),
    PATH: builders.stringLiteral(path),
    RESOURCE: builders.stringLiteral(resource),
    FIELDS_VALUE: builders.arrayExpression(
      [idField, ...nonIdFields].map((field) => {
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
    CELLS: jsxFragment`<>${nonIdFields.map(
      (field) =>
        jsxElement`<DataGridCell>${createFieldValue(
          field,
          ITEM_ID,
          entityToTitleComponent
        )}</DataGridCell>`
    )}</>`,
  });

  // Add imports for entities select components
  addImports(
    file,
    relationFields.map((field) => {
      const { relatedEntity } = field.properties as LookupResolvedProperties;
      const relatedEntitySelectComponent =
        entityToTitleComponent[relatedEntity.name];
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
    ...importContainedIdentifiers(file, IMPORTABLE_IDS),
  ]);

  return { name, file, modulePath };
}
