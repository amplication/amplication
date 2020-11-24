import React from "react";
import "./PendingChangesBar.scss";
import PendingChanges from "./PendingChanges";
import LastBuild from "./LastBuild";

const CLASS_NAME = "pending-changes-bar";

type Props = {
  applicationId: string;
};

const PendingChangesBar = ({ applicationId }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <PendingChanges applicationId={applicationId} />
      <LastBuild applicationId={applicationId} />
    </div>
  );
};

export default PendingChangesBar;
