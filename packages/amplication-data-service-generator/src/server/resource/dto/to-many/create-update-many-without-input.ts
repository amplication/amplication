import { builders, namedTypes } from "ast-types";
import { pascalCase } from "pascal-case";
import { Entity } from "../../../../types";
import { NamedClassDeclaration } from "../../../../util/ast";
import { isToManyRelationField } from "../../../../util/field";
import { createNestedInputDTO } from "./create-nested";

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
