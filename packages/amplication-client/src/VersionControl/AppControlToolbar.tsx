import React from "react";
import LockStatus, { LockData } from "./LockStatus";
import { Button, EnumButtonStyle } from "../Components/Button";
import UserAvatar from "../Components/UserAvatar";

import "./AppControlToolbar.scss";

const CLASS_NAME = "app-control-toolbar";
type Props = {
  lockData?: LockData;
};

function AppControlToolbar({ lockData }: Props) {
  return (
    <div className={CLASS_NAME}>
      {lockData && (
        <>
          <LockStatus lockData={lockData} />
          <span className={`${CLASS_NAME}__divider`}> </span>
        </>
      )}

      <Button
        buttonStyle={EnumButtonStyle.Clear}
        icon="published_with_changes"
      />
      <Button buttonStyle={EnumButtonStyle.Clear} icon="play_circle_outline" />
      <UserAvatar firstName="aaa" lastName="bbb" />
    </div>
  );
}

export default AppControlToolbar;
