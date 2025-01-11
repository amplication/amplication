import { builders, namedTypes } from "ast-types";
import { NamedClassDeclaration } from "@amplication/code-gen-types";
import { isEditableField } from "@amplication/dsg-utils";
import { EntityDtoTypeEnum } from "./entity-dto-type-enum";
import { createFieldClassProperty } from "./create-field-class-property";
import { INPUT_TYPE_DECORATOR } from "./nestjs-graphql.util";
import { classDeclaration } from "../../../utils/ast";

export const createCreateInput = (entityDTOsFilesObj) => {
  if (isEditableField(entityDTOsFilesObj.field)) {
    const property = createFieldClassProperty(
      entityDTOsFilesObj.field,
      entityDTOsFilesObj.entity,
      !entityDTOsFilesObj.field.required,
      false,
      false,
      EntityDtoTypeEnum.CreateInput
    );
    entityDTOsFilesObj.createInput.properties.push(property);
  }

  if (entityDTOsFilesObj.fieldsLen - 1 === entityDTOsFilesObj.index) {
    const decorators = entityDTOsFilesObj.createInput.properties.length
      ? [INPUT_TYPE_DECORATOR]
      : [];
    entityDTOsFilesObj.createInput.DTO = classDeclaration(
      createCreateInputID(entityDTOsFilesObj.entity.name),
      builders.classBody(entityDTOsFilesObj.createInput.properties),
      null,
      decorators
    ) as NamedClassDeclaration;
  }

  return entityDTOsFilesObj;
};

export function createCreateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}CreateInput`);
}
