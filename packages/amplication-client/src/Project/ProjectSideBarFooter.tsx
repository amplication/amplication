import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";

const ProjectSideBarFooter = () => {
  return (
    <div>
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
