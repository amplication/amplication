import React from "react";
import { Button, EnumButtonStyle } from "@amplication/design-system";
import "./PendingChangesBar.scss";
import PendingChanges from "./PendingChanges";

const CLASS_NAME = "pending-changes-bar";

type Props = {
  projectId: string;
  handleClick: () => void;
};

const PendingChangesBar = ({ projectId, handleClick }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__heading`}>
        <Button
          buttonStyle={EnumButtonStyle.Text}
          icon="close"
          iconSize="xsmall"
          onClick={handleClick}
        />
        <h2>Pending Changes</h2>
      </div>
      <PendingChanges projectId={projectId} />
    </div>
  );
};

export default PendingChangesBar;
