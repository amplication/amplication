import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Project, Workspace } from "../models";
import WorkspaceSelector from "../Workspaces/WorkspaceSelector";
import AddNewProject from "./AddNewProject";
import ProjectList from "./ProjectList";
import "./ProjectSideBar.scss";
import ProjectSideBarFooter from "./WorkspaceSettingsNavigation";

const CLASS_NAME = "project-sidebar";

type Props = {
  currentWorkspace: Workspace | undefined;
  projectsList: Project[] | null;
};

const ProjectSideBar = ({ currentWorkspace, projectsList }: Props) => {
  const history = useHistory();

  const handleProjectCreated = useCallback(
    (project: Project) => {
      history.push(`/${currentWorkspace?.id}/${project.id}`);
    },
    [currentWorkspace, history]
  );

  return currentWorkspace ? (
    <div className={CLASS_NAME}>
      <span className={`${CLASS_NAME}__label`}>Workspace</span>
      <WorkspaceSelector />
      <hr className={`${CLASS_NAME}__divider`} />
      {ProjectList && (
        <ProjectList
          projects={projectsList}
          workspaceId={currentWorkspace?.id}
        />
      )}
      <AddNewProject onProjectCreated={handleProjectCreated} />
      <hr className={`${CLASS_NAME}__divider`} />
      <ProjectSideBarFooter />
    </div>
  ) : null;
};

export default ProjectSideBar;
