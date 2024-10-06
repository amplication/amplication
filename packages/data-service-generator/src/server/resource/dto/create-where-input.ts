import { builders, namedTypes } from "ast-types";
import {
  EntityField,
  NamedClassDeclaration,
} from "@amplication/code-gen-types";
import { isScalarListField, isPasswordField } from "@amplication/dsg-utils";
import { EntityDtoTypeEnum } from "./entity-dto-type-enum";
import { createFieldClassProperty } from "./create-field-class-property";
import { INPUT_TYPE_DECORATOR } from "./nestjs-graphql.util";
import { classDeclaration } from "../../../utils/ast";

export const createWhereInput = (entityDTOsFilesObj) => {
  if (isQueryableField(entityDTOsFilesObj.field)) {
    const property = createFieldClassProperty(
      entityDTOsFilesObj.field,
      entityDTOsFilesObj.entity,
      true,
      true,
      false,
      EntityDtoTypeEnum.WhereInput
    );
    entityDTOsFilesObj.whereInput.properties.push(property);
  }

  if (entityDTOsFilesObj.fieldsLen - 1 === entityDTOsFilesObj.index) {
    const decorators = entityDTOsFilesObj.whereInput.properties.length
      ? [INPUT_TYPE_DECORATOR]
      : [];
    entityDTOsFilesObj.whereInput.DTO = classDeclaration(
      createWhereInputID(entityDTOsFilesObj.entity.name),
      builders.classBody(entityDTOsFilesObj.whereInput.properties),
      null,
      decorators
    ) as NamedClassDeclaration;
  }

  return entityDTOsFilesObj;
};

export function createWhereInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereInput`);
}

export function isQueryableField(field: EntityField): boolean {
  return (
    field.searchable && !isScalarListField(field) && !isPasswordField(field)
  );
}
