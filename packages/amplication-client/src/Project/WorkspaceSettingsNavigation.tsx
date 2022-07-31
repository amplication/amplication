import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import "./WorkspaceSettingsNavigation.scss";

const CLASS_NAME = "workspace-settings-navigation";

const WorkspaceSettingsNavigation = () => {
  const { currentWorkspace } = useContext(AppContext);
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__links`}>
        <InnerTabLink to={`/${currentWorkspace?.id}/settings`} icon="settings">
          Workspace Settings
        </InnerTabLink>
        <InnerTabLink to={`/${currentWorkspace?.id}/members`} icon="users">
          Workspace Members
        </InnerTabLink>
      </div>
    </div>
  );
};

export default WorkspaceSettingsNavigation;
