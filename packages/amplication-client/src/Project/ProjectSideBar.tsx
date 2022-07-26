import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import WorkspaceSelector from "../Workspaces/WorkspaceSelector";
import AddNewProject from "./AddNewProject";
import ProjectList from "./ProjectList";
import "./ProjectSideBar.scss";
import ProjectSideBarFooter from "./WorkspaceSettingsNavigation";

const CLASS_NAME = "project-sidebar";

const ProjectSideBar = () => {
  const { currentWorkspace, projectsList } = useContext(AppContext);

  return currentWorkspace ? (
    <div className={CLASS_NAME}>
      <span className={`${CLASS_NAME}__label`}>Workspace</span>
      <WorkspaceSelector />
      <hr className={`${CLASS_NAME}__divider`} />
      <ProjectList
          projects={projectsList}
          workspaceId={currentWorkspace?.id}
        />
      <AddNewProject />
      <ProjectSideBarFooter />
    </div>
  ) : null;
};

export default ProjectSideBar;
