import { types } from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";
import { EnumDataType } from "../models";

export const getEntityIdType = (entityName: string): types.Id["idType"] => {
  const { entities } = DsgContext.getInstance;
  const entity = entities.find((entity) => entity.name === entityName);

  if (!entity) {
    throw new Error(`entity ${entityName} not found`);
  }

  const idField = entity.fields.find(
    (field) => field.dataType === EnumDataType.Id
  );
  if (!idField) {
    throw new Error(`entity ${entityName} must have an id field`);
  }

  const idType =
    (idField.properties?.idType as types.Id["idType"]) || undefined;
  return idType ?? "CUID";
};
