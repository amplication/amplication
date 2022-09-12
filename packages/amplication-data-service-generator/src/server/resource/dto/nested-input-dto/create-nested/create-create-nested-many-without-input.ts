import { builders, namedTypes } from "ast-types";
import { pascalCase } from "pascal-case";
import { Entity, NamedClassDeclaration } from "@amplication/code-gen-types";
import {} from "../../../../../util/ast";
import { isToManyRelationField } from "../../../../../util/field";
import { EntityDtoTypeEnum } from "../../entity-dto-type-enum";
import { createNestedInputDTO } from "../create-nested-input-dto";

export function createCreateNestedManyDTOs(
  entity: Entity
): NamedClassDeclaration[] {
  const toManyFields = entity.fields.filter(isToManyRelationField);
  return toManyFields.map((field) =>
    createNestedInputDTO(
      createCreateNestedManyWithoutInputID(
        entity.pluralName,
        field.properties.relatedEntity.name
      ),
      entity,
      field,
      EntityDtoTypeEnum.RelationCreateNestedManyWithoutSourceInput
    )
  );
}

export function createCreateNestedManyWithoutInputID(
  pluralEntityName: string,
  nestedEntityName: string
): namedTypes.Identifier {
  return builders.identifier(
    `${pascalCase(nestedEntityName)}CreateNestedManyWithout${pascalCase(
      pluralEntityName
    )}Input`
  );
}
