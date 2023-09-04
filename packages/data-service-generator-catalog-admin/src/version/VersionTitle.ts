import { Version as TVersion } from "../api/version/Version";

export const VERSION_TITLE_FIELD = "name";

export const VersionTitle = (record: TVersion): string => {
  return record.name || String(record.id);
};
