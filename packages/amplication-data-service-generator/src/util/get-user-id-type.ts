import { types } from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";
import { EnumDataType } from "../models";
import { USER_ENTITY_NAME } from "../server/user-entity";

export const getUserIdType = () => {
  const { entities } = DsgContext.getInstance;
  const userEntity = entities.find(
    (entity) => entity.name === USER_ENTITY_NAME
  );

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
