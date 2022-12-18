import { types } from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";
import { EnumDataType } from "../models";
import { USER_ENTITY_NAME } from "../server/user-entity";

export const getUserIdType = () => getEntityIdType(USER_ENTITY_NAME);

export const getEntityIdType = (entityName: string) => {
  const { entities } = DsgContext.getInstance;
  const entity = entities.find((entity) => entity.name === entityName);

  if (!entity) {
    throw new Error("User entity not found");
  }

  const idField = entity.fields.find(
    (field) => field.dataType === EnumDataType.Id
  );
  if (!idField) {
    throw new Error("User entity must have an id field");
  }

  const { idType } = idField.properties as types.Id;
  return idType ?? "CUID";
};
