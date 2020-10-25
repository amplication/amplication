import { builders, namedTypes } from "ast-types";
import { isRelationField } from "../../util/entity";
import { Entity, EntityField, EnumDataType } from "../../types";
import { NamedClassDeclaration } from "../../util/ast";
import { createFieldClassProperty } from "./create-field-class-property";
import { isOneToOneRelationField, isScalarListField } from "./field.util";

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
