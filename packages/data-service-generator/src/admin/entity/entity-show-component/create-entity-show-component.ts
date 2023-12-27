import * as path from "path";
import { builders } from "ast-types";
import {
  Entity,
  EnumDataType,
  EntityField,
  LookupResolvedProperties,
  EntityComponent,
} from "@amplication/code-gen-types";
import { getFieldsFromDTOWithoutToManyRelations } from "../../../utils/entity";
import {
  addImports,
  importContainedIdentifiers,
  importNames,
  interpolate,
} from "../../../utils/ast";
import { relativeImportPath } from "../../../utils/module";
import { readFile } from "@amplication/code-gen-utils";
import { jsxElement, jsxFragment } from "../../util";
import { createFieldValue } from "../create-field-value";
import {
  REACT_ADMIN_MODULE,
  REACT_ADMIN_COMPONENTS_ID,
} from "../react-admin.util";
import DsgContext from "../../../dsg-context";

const IMPORTABLE_IDS = {
  "../user/RolesOptions": [builders.identifier("ROLES_OPTIONS")],
  [REACT_ADMIN_MODULE]: REACT_ADMIN_COMPONENTS_ID,
};

const template = path.resolve(__dirname, "entity-show-component.template.tsx");

export async function createEntityShowComponent(
  entity: Entity,
  entityToDirectory: Record<string, string>,
  entityToTitleComponent: Record<string, EntityComponent>,
  entityNameToEntity: Record<string, Entity>
): Promise<EntityComponent> {
  const file = await readFile(template);
  const name = `${entity.name}Show`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;

  //get the fields from the DTO object excluding toMany relations
  const fields = getFieldsFromDTOWithoutToManyRelations(entity);
  const relationFields: EntityField[] = fields.filter(
    (field) => field.dataType === EnumDataType.Lookup
  );

  const toManyRelationFields = entity.fields.filter((field) => {
    const properties = field.properties as LookupResolvedProperties;

    return (
      field.dataType === EnumDataType.Lookup &&
      field.searchable &&
      properties.allowMultipleSelection &&
      !(properties.relatedField.properties as LookupResolvedProperties)
        .allowMultipleSelection
    );
  });

  const toManyRelationData = toManyRelationFields.map((relatedField) => {
    return createToManyReferenceField(entity, relatedField, entityNameToEntity);
  });

  const toManyRelationElements = toManyRelationData.map((item) => item.element);

  //The list of entities related to the an immediate related entities
  const relatedEntitiesNames = toManyRelationData.flatMap(
    (item) => item.relatedEntitiesNames
  );

  //add the list of immediate related entities
  const allRelatedEntitiesNames = relatedEntitiesNames.concat(
    relationFields.map((field) => {
      const { relatedEntity } = field.properties as LookupResolvedProperties;
      return relatedEntity.name;
    })
  );

  interpolate(file, {
    ENTITY_SHOW: builders.identifier(name),
    FIELDS: jsxFragment`<>${fields.map(
      (field) => jsxElement`${createFieldValue(field)}`
    )}
    ${toManyRelationElements}
    </>`,
  });

  // Add imports for entities title components
  addImports(
    file,
    allRelatedEntitiesNames.map((entityName) => {
      const relatedEntityTitleComponent = entityToTitleComponent[entityName];
      return importNames(
        [builders.identifier(`${entityName.toUpperCase()}_TITLE_FIELD`)],
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
  entityNameToEntity: Record<string, Entity>
) {
  const { relatedEntity } = field.properties as LookupResolvedProperties;

  const relatedEntityWithResolvedFields =
    entityNameToEntity[relatedEntity.name];

  if (!relatedEntityWithResolvedFields) {
    throw new Error(`Cannot find entity: ${relatedEntity.name}`);
  }

  const fields = getFieldsFromDTOWithoutToManyRelations(
    relatedEntityWithResolvedFields
  );

  //return the names of the related entities to be used to import the title components
  const relatedEntitiesNames = fields
    .filter((field) => field.dataType === EnumDataType.Lookup)
    .map(
      (field) =>
        (field.properties as LookupResolvedProperties).relatedEntity.name
    );

  const context = DsgContext.getInstance;

  const relatedEntityWithFields = context.entities.find(
    (entity) => entity.name === relatedEntity.name
  );

  const relatedFieldWithProperties = relatedEntityWithFields.fields.find(
    (fieldWithProperties) =>
      fieldWithProperties.name === field.properties.relatedField.name
  );

  const fkFieldName = (
    relatedFieldWithProperties.properties as LookupResolvedProperties
  ).fkFieldName;

  const element = jsxElement` 
  <ReferenceManyField
    reference="${field.properties.relatedEntity.name}"
    target="${fkFieldName}"
    label="${field.properties.relatedEntity.pluralDisplayName}"
  >
    <Datagrid rowClick="show">
      ${fields.map((field) => jsxElement`${createFieldValue(field)}`)}
    </Datagrid>
  </ReferenceManyField>`;

  return { element, relatedEntitiesNames };
}
