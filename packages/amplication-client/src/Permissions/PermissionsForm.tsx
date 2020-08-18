import React, { useMemo, useCallback } from "react";
import { Formik, Form } from "formik";
import { DrawerContent } from "@rmwc/drawer";
import difference from "@extra-set/difference";
import "@rmwc/drawer/styles";

import "./PermissionsForm.scss";

import * as models from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import SidebarHeader from "../Layout/SidebarHeader";
import { PermissionsField } from "./PermissionsField";

import * as permissionsTypes from "./types";
import groupBy from "lodash.groupby";

/** this component should also be used to manage EntityFieldPermission (and BlockPermission?) */
type PermissionsInput = models.EntityPermission[]; //| models.EntityFieldPermission[];

type Props = {
  permissions: PermissionsInput;
  availableActions: permissionsTypes.PermissionAction[];
  backUrl: string;
  applicationId: string;
  objectDisplayName: string;
  onSubmit: (update: models.EntityUpdatePermissionsInput) => void;
};

type PermissionItemsByActionName = {
  [actionName: string]: permissionsTypes.PermissionItem[];
};

const PermissionsForm = ({
  permissions,
  availableActions,
  backUrl,
  applicationId,
  objectDisplayName,
  onSubmit,
}: Props) => {
  const initialValues = useMemo(() => {
    let defaultGroups = Object.fromEntries(
      availableActions.map((action) => [action.action.toString(), []])
    );

    let permissionItems = permissions.map((permission) => ({
      roleId: permission.appRoleId,
      roleName: permission.appRole?.displayName || "",
      actionName: permission.action,
    }));

    let groupedValues = groupBy(
      permissionItems,
      (permission: permissionsTypes.PermissionItem) => permission.actionName
    );

    return {
      ...defaultGroups,
      ...groupedValues,
    };
  }, [permissions, availableActions]);

  const handleSubmit = useCallback(
    (permissions: {
      [actionName: string]: permissionsTypes.PermissionItem[];
    }) => {
      const changes = getChanges(initialValues, permissions);
      onSubmit(changes);
    },
    [initialValues, onSubmit]
  );

  return (
    <div className="permissions-form">
      <SidebarHeader showBack backUrl={backUrl}>
        Permissions
      </SidebarHeader>
      <DrawerContent>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {(formik) => {
            return (
              <>
                <Form>
                  <FormikAutoSave debounceMS={1000} />
                  {availableActions.map((action) => (
                    <PermissionsField
                      applicationId={applicationId}
                      name={action.action}
                      actionDisplayName={action.actionDisplayName}
                      entityDisplayName={objectDisplayName}
                    />
                  ))}
                </Form>
              </>
            );
          }}
        </Formik>
      </DrawerContent>
    </div>
  );
};

export default PermissionsForm;

function getChanges(
  previousPermissions: PermissionItemsByActionName,
  nextPermissions: PermissionItemsByActionName
): models.EntityUpdatePermissionsInput {
  const add: models.EntityPermissionWhereUniqueInput[] = [];
  const remove: models.EntityPermissionWhereUniqueInput[] = [];
  for (const [actionName, items] of Object.entries(previousPermissions)) {
    // Overcome TypeScript inability to understand Object.entries type
    const previousItems = items as permissionsTypes.PermissionItem[];
    // Join previous items with next items according to actionName
    const nextItems = nextPermissions[actionName];
    // Extract role ID sets for easy comparison
    const existingRoleIds = new Set(previousItems.map((item) => item.roleId));
    const nextRoleIds = new Set(nextItems.map((item) => item.roleId));
    const addedRoleIds = difference(nextRoleIds, existingRoleIds);
    const removedRoleIds = difference(existingRoleIds, nextRoleIds);
    // Map role IDs to expected format
    const addedPermissions = Array.from(addedRoleIds, (roleId) => ({
      appRoleId: roleId as string,
      action: actionName as models.EnumEntityAction,
    }));
    const removedPermissions = Array.from(removedRoleIds, (roleId) => ({
      appRoleId: roleId as string,
      action: actionName as models.EnumEntityAction,
    }));
    add.push(...addedPermissions);
    remove.push(...removedPermissions);
  }
  return { add, remove };
}
