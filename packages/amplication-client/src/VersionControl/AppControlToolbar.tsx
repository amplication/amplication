import React from "react";
import LockStatus, { LockData } from "./LockStatus";
import { NavLink, useRouteMatch } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import UserBadge from "../Components/UserBadge";

import "./AppControlToolbar.scss";

const CLASS_NAME = "app-control-toolbar";
type Props = {
  lockData?: LockData;
};

function AppControlToolbar({ lockData }: Props) {
  const match = useRouteMatch<{ applicationId: string }>("/:applicationId/");
  if (!match) {
    throw new Error("Sidebar was rendered outside of entities view");
  }
  const { applicationId } = match?.params;

  return (
    <div className={CLASS_NAME}>
      {lockData && lockData.lockedByUser && (
        <>
          <LockStatus lockData={lockData} />
          <span className={`${CLASS_NAME}__divider`}> </span>
        </>
      )}
      <NavLink to={`/${applicationId}/pending-changes`}>
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          icon="published_with_changes"
        />
      </NavLink>
      <Button
        className={`${CLASS_NAME}__publish`}
        buttonStyle={EnumButtonStyle.CallToAction}
      >
        Publish
      </Button>
      <UserBadge />
    </div>
  );
}

export default AppControlToolbar;
