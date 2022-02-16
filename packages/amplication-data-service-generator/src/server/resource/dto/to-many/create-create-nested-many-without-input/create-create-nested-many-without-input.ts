import { Entity } from "../../../../../types";
import { NamedClassDeclaration } from "../../../../../util/ast";
import { isToManyRelationField } from "../../../../../util/field";
import { EntityDtoTypeEnum } from "../../entity-dto-type-enum";
import { createNestedInputDTO } from "../create-nested";
import { createCreateNestedManyWithoutInputID } from "./create-ast-id";

export function createCreateNestedManyDTOs(
  entity: Entity
): NamedClassDeclaration[] {
  const toManyFields = entity.fields.filter(isToManyRelationField);
  return toManyFields.map((field) =>
    createNestedInputDTO(
      createCreateNestedManyWithoutInputID(
        entity.pluralDisplayName,
        field.properties.relatedEntity.name
      ),
      entity,
      field,
      EntityDtoTypeEnum.RelationCreateNestedManyWithoutSourceInput
    )
  );
}
