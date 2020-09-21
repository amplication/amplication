import React from "react";
import LockStatus, { LockData } from "./LockStatus";
import { useRouteMatch, NavLink } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import UserBadge from "../Components/UserBadge";
import PendingChangesStatus from "./PendingChangesStatus";
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
      {lockData && (
        <>
          <LockStatus lockData={lockData} applicationId={applicationId} />
          <span className={`${CLASS_NAME}__divider`}> </span>
        </>
      )}
      <PendingChangesStatus applicationId={applicationId} />
      <NavLink to={`/${applicationId}/builds`}>
        <Button
          className={`${CLASS_NAME}__publish`}
          buttonStyle={EnumButtonStyle.CallToAction}
        >
          Publish
        </Button>
      </NavLink>
      <UserBadge />
    </div>
  );
}

export default AppControlToolbar;
