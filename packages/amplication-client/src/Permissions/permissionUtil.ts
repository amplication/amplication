import * as models from "../models";
import { PermissionByActionName, PermissionAction } from "./types";
import { keyBy } from "lodash";

export function preparePermissionsByAction(
  availableActions: PermissionAction[],
  permissions?: models.EntityPermission[] | null
): PermissionByActionName {
  const defaultGroups = Object.fromEntries(
    availableActions.map((action) => [
      action.action.toString(),
      getDefaultEntityPermission(action.action),
    ])
  );

  const groupedValues = keyBy(permissions, (permission) => permission.action);

  return {
    ...defaultGroups,
    ...groupedValues,
  };
}

/**
 * Returns an empty EntityPermission object to be used for Actions that were never saved
 */
function getDefaultEntityPermission(
  actionName: models.EnumEntityAction
): models.EntityPermission {
  return {
    id: "",
    type: models.EnumEntityPermissionType.Disabled,
    entityVersionId: "",
    action: actionName,
  };
}
