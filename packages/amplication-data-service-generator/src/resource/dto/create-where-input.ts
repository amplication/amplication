import { builders, namedTypes } from "ast-types";
import { isRelationField } from "../../util/entity";
import { Entity, EntityField, EnumDataType } from "../../types";
import { NamedClassDeclaration } from "../../util/ast";
import { createFieldClassProperty } from "./create-field-class-property";
import { isOneToOneRelationField, isScalarListField } from "./field.util";

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY_ID_TO_NAME: Record<string, string> = {
  [EXAMPLE_ENTITY_ID]: EXAMPLE_ENTITY_NAME,
};

const EXAMPLE_ENTITY_FIELD_NAME = "exampleEntityFieldName";
const EXAMPLE_ENTITY_FIELD: EntityField = {
  name: EXAMPLE_ENTITY_FIELD_NAME,
  displayName: "Example Entity Field Display Name",
  description: "Example entity field description",
  dataType: EnumDataType.Id,
  required: true,
  searchable: false,
};
const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ENTITY_FIELD],
  permissions: [],
};

export function createWhereInput(
  entity: Entity,
  entityIdToName: Record<string, string>
): NamedClassDeclaration {
  const properties = entity.fields
    .filter((field) => isQueryableField(field))
    /** @todo support filters */
    .map((field) =>
      createFieldClassProperty(field, true, true, entityIdToName)
    );
  return builders.classDeclaration(
    createWhereInputID(entity.name),
    builders.classBody(properties)
  ) as NamedClassDeclaration;
}

export function createWhereInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereInput`);
}

export function isQueryableField(field: EntityField): boolean {
  return (
    !isScalarListField(field) &&
    (!isRelationField(field) || isOneToOneRelationField(field))
  );
}
