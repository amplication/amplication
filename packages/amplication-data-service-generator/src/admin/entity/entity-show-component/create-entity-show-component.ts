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
import {
  REACT_ADMIN_MODULE,
  REACT_ADMIN_COMPONENTS_ID,
} from "../react-admin.util";

const IMPORTABLE_IDS = {
  "../user/RolesOptions": [builders.identifier("ROLES_OPTIONS")],
  [REACT_ADMIN_MODULE]: REACT_ADMIN_COMPONENTS_ID,
};

const template = path.resolve(__dirname, "entity-show-component.template.tsx");

export async function createEntityShowComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  entityToTitleComponent: Record<string, EntityComponent>,
  allEntities: Entity[]
): Promise<EntityComponent> {
  const file = await readFile(template);
  const name = `${entity.name}Show`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  const entityDTO = dtos[entity.name].entity;
  const fieldNameToField = Object.fromEntries(
    entity.fields.map((field) => [field.name, field])
  );
  const entityDTOProperties = getNamedProperties(entityDTO);
  const fields = entityDTOProperties.map(
    (property) => fieldNameToField[property.key.name]
  );
  const relationFields: EntityField[] = fields.filter(
    (field) => field.dataType === EnumDataType.Lookup
  );

  const toManyRelationFields = entity.fields.filter((field) => {
    return (
      field.dataType === EnumDataType.Lookup &&
      (field.properties as LookupResolvedProperties).allowMultipleSelection
    );
  });

  const referenceFields = toManyRelationFields.map((relatedField) => {
    return createToManyReferenceField(entity, relatedField, dtos, allEntities);
  });

  interpolate(file, {
    ENTITY_SHOW: builders.identifier(name),
    FIELDS: jsxFragment`<>${fields.map(
      (field) => jsxElement`${createFieldValue(field)}`
    )}
    ${referenceFields}
    </>`,
  });

  // Add imports for entities title components
  addImports(
    file,
    relationFields.map((field) => {
      const { relatedEntity } = field.properties as LookupResolvedProperties;
      const relatedEntityTitleComponent =
        entityToTitleComponent[relatedEntity.name];
      return importNames(
        [
          builders.identifier(
            `${relatedEntity.name.toUpperCase()}_TITLE_FIELD`
          ),
        ],
        relativeImportPath(modulePath, relatedEntityTitleComponent.modulePath)
      );
    })
  );

  addImports(file, [...importContainedIdentifiers(file, IMPORTABLE_IDS)]);

  return { name, file, modulePath };
}

function createToManyReferenceField(
  entity: Entity,
  field: EntityField,
  dtos: DTOs,
  allEntities: Entity[]
) {
  const { relatedEntity } = field.properties as LookupResolvedProperties;

  const relatedEntityWithResolvedFields = allEntities.find(
    (entity) => entity.name === relatedEntity.name
  );

  if (!relatedEntityWithResolvedFields) {
    throw new Error(`Cannot find entity: ${relatedEntity.name}`);
  }

  const entityDTO = dtos[relatedEntity.name].entity;

  const fieldNameToField = Object.fromEntries(
    relatedEntityWithResolvedFields.fields.map((field) => [field.name, field])
  );

  const entityDTOProperties = getNamedProperties(entityDTO);
  const fields = entityDTOProperties.map(
    (property) => fieldNameToField[property.key.name]
  );

  const element = jsxElement` 
  <ReferenceManyField
    reference="${field.properties.relatedEntity.name}"
    target="${entity.name}Id"
    label="${field.properties.relatedEntity.pluralDisplayName}"
  >
    <Datagrid>
      ${fields.map((field) => jsxElement`${createFieldValue(field)}`)}
    </Datagrid>
  </ReferenceManyField>`;

  return element;
}
