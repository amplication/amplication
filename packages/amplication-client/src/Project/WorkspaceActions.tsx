import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";

const CLASS_NAME = "workspace-actions";

const WorkspaceActions = () => {
  return (
    <div className={CLASS_NAME}>
      <InnerTabLink to={`/workspace/settings`} icon="settings">
        Workspace Settings
      </InnerTabLink>
      <InnerTabLink to={`/workspace/members`} icon="users">
        Workspace Members
      </InnerTabLink>
    </div>
  );
};

export default WorkspaceActions;
