import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";
import "./ProjectSideBarFooter.scss";

const CLASS_NAME = 'side-bar-layout';

export const ProjectSideBarFooter = () => {
    return (
        <div className={`${CLASS_NAME}__tabs`}>
          <InnerTabLink to={`/workspace/settings`} icon="settings">
            Workspace Settings
          </InnerTabLink>
          <InnerTabLink to={`/workspace/members`} icon="users">
            Workspace Members
          </InnerTabLink>
        </div>
      );
}
