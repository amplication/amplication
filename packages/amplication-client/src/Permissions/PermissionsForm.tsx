import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import { DrawerContent } from "@rmwc/drawer";
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
  onSubmit: (permissions: {
    [index: string]: permissionsTypes.PermissionItem[];
  }) => void;
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

  return (
    <div className="permissions-form">
      <SidebarHeader showBack backUrl={backUrl}>
        Permissions
      </SidebarHeader>
      <DrawerContent>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={onSubmit}
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
