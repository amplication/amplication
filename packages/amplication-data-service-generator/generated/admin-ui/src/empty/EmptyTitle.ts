import { Empty as TEmpty } from "../api/empty/Empty";

export const EMPTY_TITLE_FIELD = "id";

export const EmptyTitle = (record: TEmpty): string => {
  return record.id || String(record.id);
};
