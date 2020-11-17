import React, { useContext } from "react";
import { Icon } from "@rmwc/icon";
import "./PendingChangesBar.scss";
import PendingChangesContext from "../VersionControl/PendingChangesContext";

const CLASS_NAME = "pending-changes-bar";
const ICON_SIZE = "xlarge";

type Props = {
  applicationId: string;
};

const PendingChangesBar = ({ applicationId }: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);

  return (
    <div className={CLASS_NAME}>
      <Icon
        icon={{
          icon: "pending_changes",
          size: ICON_SIZE,
        }}
      />
      <span className={`${CLASS_NAME}__counter`}>
        {pendingChangesContext.pendingChanges.length.toString()}
      </span>
    </div>
  );
};

export default PendingChangesBar;
