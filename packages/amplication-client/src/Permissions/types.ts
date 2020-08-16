import * as models from "../models";

export type PermissionAction = {
  action: models.EnumEntityAction;
  actionDisplayName: string;
  objectDisplayName: string;
};

export type PermissionItem = {
  roleId: string;
  roleName: string;
  actionName: string;
};
