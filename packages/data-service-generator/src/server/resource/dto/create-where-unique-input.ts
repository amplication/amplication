import { builders, namedTypes } from "ast-types";
import {
  EntityField,
  EnumDataType,
  NamedClassDeclaration,
} from "@amplication/code-gen-types";
import { EntityDtoTypeEnum } from "./entity-dto-type-enum";
import { classDeclaration } from "../../../utils/ast";
import { INPUT_TYPE_DECORATOR } from "./nestjs-graphql.util";
import { createFieldClassProperty } from "./create-field-class-property";

export const createWhereUniqueInput = (entityDTOsFilesObj) => {
  if (isUniqueField(entityDTOsFilesObj.field)) {
    const property = createFieldClassProperty(
      entityDTOsFilesObj.field,
      entityDTOsFilesObj.entity,
      !entityDTOsFilesObj.field.required,
      false, //do not use as query since the ID field in WhereUniqueInput is required
      false,
      EntityDtoTypeEnum.WhereUniqueInput
    );
    entityDTOsFilesObj.whereUniqueInput.properties.push(property);
  }

  if (entityDTOsFilesObj.fieldsLen - 1 === entityDTOsFilesObj.index) {
    const decorators = entityDTOsFilesObj.whereUniqueInput.properties.length
      ? [INPUT_TYPE_DECORATOR]
      : [];
    entityDTOsFilesObj.whereUniqueInput.DTO = classDeclaration(
      createWhereUniqueInputID(entityDTOsFilesObj.entity.name),
      builders.classBody(entityDTOsFilesObj.whereUniqueInput.properties),
      null,
      decorators
    ) as NamedClassDeclaration;
  }

  return entityDTOsFilesObj;
};

export function createWhereUniqueInputID(
  entityName: string
): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereUniqueInput`);
}

export function isUniqueField(field: EntityField): boolean {
  return field.dataType === EnumDataType.Id;
}
