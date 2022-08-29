import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";

const CLASS_NAME = "git-status-connected-details";

const GitStatusConnectedDetails: React.FC<{}> = () => {
  const { gitRepositoryFullName } = useContext(AppContext);
  return (
    <div className={`${CLASS_NAME}`}>
      {gitRepositoryFullName}
    </div>
  );
};

export default GitStatusConnectedDetails;
