import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";
import "./ProjectSideBarFooter.scss";

const CLASS_NAME = "sidebar-footer ";

const ProjectSideBarFooter = () => {
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

export default ProjectSideBarFooter;
