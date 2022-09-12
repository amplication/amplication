import { builders, namedTypes } from "ast-types";
import { pascalCase } from "pascal-case";
import { Entity, NamedClassDeclaration } from "@amplication/code-gen-types";
import {} from "../../../../../util/ast";
import { isToManyRelationField } from "../../../../../util/field";
import { EntityDtoTypeEnum } from "../../entity-dto-type-enum";
import { createNestedInputDTO } from "../create-nested-input-dto";

export function createUpdateManyWithoutInputDTOs(
  entity: Entity
): NamedClassDeclaration[] {
  const toManyFields = entity.fields.filter(isToManyRelationField);
  return toManyFields.map((field) =>
    createNestedInputDTO(
      createUpdateManyWithoutInputID(
        entity.pluralName,
        field.properties.relatedEntity.name
      ),
      entity,
      field,
      EntityDtoTypeEnum.RelationUpdateManyWithoutSourceInput
    )
  );
}

export function createUpdateManyWithoutInputID(
  pluralEntityName: string,
  nestedEntityName: string
): namedTypes.Identifier {
  return builders.identifier(
    `${pascalCase(nestedEntityName)}UpdateManyWithout${pascalCase(
      pluralEntityName
    )}Input`
  );
}
