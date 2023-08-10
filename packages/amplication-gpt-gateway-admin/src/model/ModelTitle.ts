import { Model as TModel } from "../api/model/Model";

export const MODEL_TITLE_FIELD = "name";

export const ModelTitle = (record: TModel): string => {
  return record.name || String(record.id);
};
