import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import { DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";

import "./PermissionsForm.scss";

import * as models from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import SidebarHeader from "../Layout/SidebarHeader";
import {
  PermissionsField,
  PermissionItem,
} from "../Components/PermissionsField";

/** this component should also be used to manage EntityFieldPermission (and BlockPermission?) */
type PermissionsInput = models.EntityPermission[]; //| models.EntityFieldPermission[];

type AvailableAction = {
  action: models.EnumEntityAction;
  displayName: string;
  entityDisplayName: string;
};

type Props = {
  permissions: PermissionsInput;
  availableActions: AvailableAction[];
  backUrl: string;
  applicationId: string;
  onSubmit: (permissions: { [index: string]: PermissionItem[] }) => void;
};

const PermissionsForm = ({
  permissions,
  availableActions,
  backUrl,
  applicationId,
  onSubmit,
}: Props) => {
  const initialValues = useMemo(() => {
    let result: { [index: string]: PermissionItem[] } = {};

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
                        actionDisplayName={action.displayName}
                        entityDisplayName={action.entityDisplayName}
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
