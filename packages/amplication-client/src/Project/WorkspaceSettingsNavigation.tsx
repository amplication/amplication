import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";
import "./WorkspaceSettingsNavigation.scss";

const CLASS_NAME = "workspace-settings-navigation";

const WorkspaceSettingsNavigation = () => {
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

export default WorkspaceSettingsNavigation;
