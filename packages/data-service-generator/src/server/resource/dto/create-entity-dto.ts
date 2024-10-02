import { builders } from "ast-types";
import { NamedClassDeclaration } from "@amplication/code-gen-types";
import { classDeclaration } from "../../../utils/ast";
import { isPasswordField } from "@amplication/dsg-utils";
import { createFieldClassProperty } from "./create-field-class-property";
import { EntityDtoTypeEnum } from "./entity-dto-type-enum";
import { OBJECT_TYPE_ID } from "./nestjs-graphql.util";

export const OBJECT_TYPE_DECORATOR = builders.decorator(
  builders.callExpression(OBJECT_TYPE_ID, [])
);

export const createEntityDTO = (entityDTOsFilesObj) => {
  if (!isPasswordField(entityDTOsFilesObj.field)) {
    const property = createFieldClassProperty(
      entityDTOsFilesObj.field,
      entityDTOsFilesObj.entity,
      !entityDTOsFilesObj.field.required,
      false,
      true,
      EntityDtoTypeEnum.Entity
    );

    entityDTOsFilesObj.entityDTO.properties.push(property);
  }

  if (entityDTOsFilesObj.fieldsLen - 1 === entityDTOsFilesObj.index) {
    entityDTOsFilesObj.entityDTO.DTO = classDeclaration(
      builders.identifier(entityDTOsFilesObj.entity.name),
      builders.classBody(entityDTOsFilesObj.entityDTO.properties),
      null,
      [OBJECT_TYPE_DECORATOR]
    ) as NamedClassDeclaration;
  }

  return entityDTOsFilesObj;
};
