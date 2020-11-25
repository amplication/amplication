import React from "react";
import "./PendingChangesBar.scss";
import PendingChanges from "./PendingChanges";
import LastCommit from "./LastCommit";

const CLASS_NAME = "pending-changes-bar";

type Props = {
  applicationId: string;
};

const PendingChangesBar = ({ applicationId }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <PendingChanges applicationId={applicationId} />
      <LastCommit applicationId={applicationId} />
    </div>
  );
};

export default PendingChangesBar;
