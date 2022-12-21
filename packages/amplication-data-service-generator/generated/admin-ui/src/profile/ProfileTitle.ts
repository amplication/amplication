import { Profile as TProfile } from "../api/profile/Profile";

export const PROFILE_TITLE_FIELD = "id";

export const ProfileTitle = (record: TProfile): string => {
  return record.id || String(record.id);
};
