import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import { DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";

import omitDeep from "deepdash-es/omitDeep";

import * as models from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import SidebarHeader from "../Layout/SidebarHeader";
import { PermissionsField } from "../Components/PermissionsField";

/** this component should also be used to manage EntityFieldPermission (and BlockPermission?) */
type PermissionsInput = models.EntityPermission[]; //| models.EntityFieldPermission[];

type AvailableAction = {
  /**The action */
  action: models.EnumEntityAction;
  displayName: string;
  entityDisplayName: string;
};

type Props = {
  permissions?: PermissionsInput | null;
  availableActions: AvailableAction[];
  backUrl: string;
  onSubmit: (permissions: PermissionsInput) => void;
};

const NON_INPUT_GRAPHQL_PROPERTIES = ["entityVersion", "appRole", "__typename"];

const EntityForm = ({
  permissions,
  availableActions,
  backUrl,
  onSubmit,
}: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omitDeep(
      {
        ...permissions,
      },
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return sanitizedDefaultValues as PermissionsInput;
  }, [permissions]);

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
                    <PermissionsField
                      permissions={permissions}
                      action={models.EnumEntityAction.Create}
                      actionDisplayName="Create"
                      entityDisplayName="Customers"
                    />
                    {JSON.stringify(initialValues)}
                    {/**@ todo:complete display  */}
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

export default EntityForm;
