import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";
import "./WorkspaceSettingsNavigation.scss";

const CLASS_NAME = "workspace-settings-navigation";

const WorkspaceSettingsNavigation = () => {
  return (
    <div className={CLASS_NAME}>
      <hr className={`${CLASS_NAME}__divider`} />
      <div className={`${CLASS_NAME}__links`}>
        <InnerTabLink to={`/workspace/settings`} icon="settings">
          Workspace Settings
        </InnerTabLink>
        <InnerTabLink to={`/workspace/members`} icon="users">
          Workspace Members
        </InnerTabLink>
      </div>
    </div>
  );
};

export default WorkspaceSettingsNavigation;
