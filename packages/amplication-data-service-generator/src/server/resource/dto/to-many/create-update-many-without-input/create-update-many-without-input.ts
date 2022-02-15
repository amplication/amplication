import { Entity } from "../../../../../types";
import { NamedClassDeclaration } from "../../../../../util/ast";
import { isToManyRelationField } from "../../../../../util/field";
import { createNestedInputDTO } from "../create-nested";
import { createUpdateManyWithoutInputID } from "./create-ast-id";

export function createUpdateManyWithoutInputDTOs(
  entity: Entity
): NamedClassDeclaration[] {
  const toManyFields = entity.fields.filter(isToManyRelationField);
  return toManyFields.map((field) =>
    createNestedInputDTO(
      createUpdateManyWithoutInputID(
        entity.pluralDisplayName,
        field.properties.relatedEntity.name
      ),
      entity,
      field
    )
  );
}
