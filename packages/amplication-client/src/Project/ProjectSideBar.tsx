import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import WorkspaceSelector from "../Workspaces/WorkspaceSelector";
import ProjectList from "./ProjectList";
import ProjectSideBarFooter from "./WorkspaceSettingsNavigation";
import "./ProjectSideBar.scss";

const CLASS_NAME = "project-sidebar";

const ProjectSideBar = () => {
  const { currentWorkspace, projectsList } = useContext(AppContext);

  return (
    <div className={CLASS_NAME}>
      <p className={`${CLASS_NAME}__label`}>Workspace</p>
      <WorkspaceSelector />
      <hr className={`${CLASS_NAME}__divider`} />
      <ProjectList projects={projectsList} workspaceId={currentWorkspace?.id} />
      <hr className={`${CLASS_NAME}__divider`} />
      <ProjectSideBarFooter />
    </div>
  );
};

export default ProjectSideBar;
