import { types } from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";
import { EnumDataType } from "../models";

export const getUserIdType = () => {
  const { entities, userEntityName } = DsgContext.getInstance;
  const userEntity = entities.find((entity) => entity.name === userEntityName);

  if (!userEntity) {
    throw new Error("User entity not found");
  }

  const idField = userEntity.fields.find(
    (field) => field.dataType === EnumDataType.Id
  );
  if (!idField) {
    throw new Error("User entity must have an id field");
  }

  const { idType } = idField.properties as types.Id;
  return idType ?? "CUID";
};
