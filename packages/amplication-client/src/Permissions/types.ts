import * as models from "../models";

export type PermissionAction = {
  action: models.EnumEntityAction;
  actionDisplayName: string;
};

export type PermissionItem = {
  roleId: string;
  roleName: string;
  actionName: string;
};
