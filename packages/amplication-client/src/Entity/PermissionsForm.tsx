import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import { DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";

import "./PermissionsForm.scss";

import * as models from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import SidebarHeader from "../Layout/SidebarHeader";
import { PermissionsField } from "../Components/PermissionsField";

import * as types from "../types";

/** this component should also be used to manage EntityFieldPermission (and BlockPermission?) */
type PermissionsInput = models.EntityPermission[]; //| models.EntityFieldPermission[];

type Props = {
  permissions: PermissionsInput;
  availableActions: types.PermissionAction[];
  backUrl: string;
  applicationId: string;
  onSubmit: (permissions: { [index: string]: types.PermissionItem[] }) => void;
};

const PermissionsForm = ({
  permissions,
  availableActions,
  backUrl,
  applicationId,
  onSubmit,
}: Props) => {
  const initialValues = useMemo(() => {
    let result: { [index: string]: types.PermissionItem[] } = {};

    availableActions.forEach((action) => {
      let actionName = action.action.toString();
      result[actionName] = permissions
        .filter((permission) => permission.action === actionName)
        .map((permission) => ({
          roleId: permission.appRoleId,
          roleName: permission.appRole?.displayName || "",
          actionName: permission.action,
        }));
    });

    return result;
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
                  <>
                    <FormikAutoSave debounceMS={1000} />
                    {availableActions.map((action) => (
                      <PermissionsField
                        applicationId={applicationId}
                        name={action.action}
                        actionDisplayName={action.actionDisplayName}
                        entityDisplayName={action.objectDisplayName}
                      />
                    ))}
                  </>
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
