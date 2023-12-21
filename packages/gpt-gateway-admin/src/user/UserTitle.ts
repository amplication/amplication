import { User as TUser } from "../api/user/User";

export const USER_TITLE_FIELD = "firstName";

export const UserTitle = (record: TUser): string => {
  return record.firstName || String(record.id);
};
