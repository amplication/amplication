import { builders, namedTypes } from "ast-types";
import { NamedClassDeclaration } from "@amplication/code-gen-types";
import { isEditableField } from "@amplication/dsg-utils";
import { EntityDtoTypeEnum } from "./entity-dto-type-enum";
import { INPUT_TYPE_DECORATOR } from "./nestjs-graphql.util";
import { classDeclaration } from "../../../utils/ast";
import { createFieldClassProperty } from "./create-field-class-property";

export const createUpdateInput = (entityDTOsFilesObj) => {
  if (isEditableField(entityDTOsFilesObj.field)) {
    const property = createFieldClassProperty(
      entityDTOsFilesObj.field,
      entityDTOsFilesObj.entity,
      true,
      false,
      false,
      EntityDtoTypeEnum.UpdateInput
    );
    entityDTOsFilesObj.updateInput.properties.push(property);
  }

  if (entityDTOsFilesObj.fieldsLen - 1 === entityDTOsFilesObj.index) {
    const decorators = entityDTOsFilesObj.updateInput.properties.length
      ? [INPUT_TYPE_DECORATOR]
      : [];

    entityDTOsFilesObj.updateInput.DTO = classDeclaration(
      createUpdateInputID(entityDTOsFilesObj.entity.name),
      builders.classBody(entityDTOsFilesObj.updateInput.properties),
      null,
      decorators
    ) as NamedClassDeclaration;
  }

  return entityDTOsFilesObj;
};

export function createUpdateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}UpdateInput`);
}
