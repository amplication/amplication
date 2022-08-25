import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import WorkspaceSelector from "../Workspaces/WorkspaceSelector";
import AddNewProject from "./AddNewProject";
import ProjectList from "./ProjectList";
import ProjectSideBarFooter from "./WorkspaceSettingsNavigation";
import "./ProjectSideBar.scss";

const CLASS_NAME = "project-sidebar";

const ProjectSideBar = () => {
  const { currentWorkspace, projectsList } = useContext(AppContext);

  return currentWorkspace ? (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__project-wrapper`}>
        <p className={`${CLASS_NAME}__label`}>Workspace</p>
        <WorkspaceSelector />
        <hr className={`${CLASS_NAME}__divider`} />
        <ProjectList
          projects={projectsList}
          workspaceId={currentWorkspace?.id}
        />
        <AddNewProject />
      </div>
      <hr className={`${CLASS_NAME}__divider`} />
      <ProjectSideBarFooter />
    </div>
  ) : null;
};

export default ProjectSideBar;
