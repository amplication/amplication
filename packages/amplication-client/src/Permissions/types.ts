import * as models from "../models";

export type PermissionAction = {
  action: models.EnumEntityAction;
  actionDisplayName: string;
  canSetFields: boolean;
};

export type PermissionByActionName = {
  [actionName: string]: models.EntityPermission;
};
