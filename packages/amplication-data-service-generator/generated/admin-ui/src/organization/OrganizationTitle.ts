import { Organization as TOrganization } from "../api/organization/Organization";

export const ORGANIZATION_TITLE_FIELD = "name";

export const OrganizationTitle = (record: TOrganization): string => {
  return record.name || String(record.id);
};
