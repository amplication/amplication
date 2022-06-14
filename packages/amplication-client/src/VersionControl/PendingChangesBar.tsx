import React from "react";
import { Button, EnumButtonStyle } from "@amplication/design-system";
import "./PendingChangesBar.scss";
import PendingChanges from "./PendingChanges";

const CLASS_NAME = "pending-changes-bar";

type Props = {
  resourceId: string;
  handleClick: () => void;
};

const PendingChangesBar = ({ resourceId, handleClick }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__heading`}>
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          icon="close"
          iconSize="xsmall"
          onClick={handleClick}
        />
        <h2>Pending Changes</h2>
      </div>
      <PendingChanges resourceId={resourceId} />
    </div>
  );
};

export default PendingChangesBar;
