import React from "react";
import { Project, Workspace } from "../models";
import ProjectList from "./ProjectList";
import "./ProjectSideBar.scss";
import ProjectSideBarFooter from "./WorkspaceSettingsNavigation";
import WorkspaceSelectorNew from "./WorkspaceSelectorNew";

const CLASS_NAME = "project-sidebar";

type Props = {
  currentWorkspace: Workspace;
  currentProject: Project;
  projectsList: Project[];
  setNewProject: (project: Project) => void;
  newProjectRes: () => void;
  handleSetCurrentWorkspace: (workspaceId: string) => void;
};

const ProjectSideBar = ({
  currentWorkspace,
  projectsList,
  setNewProject,
}: Props) => {
  return (
    <div className={CLASS_NAME}>
      <span className={`${CLASS_NAME}__label`}>Workspace</span>
      <WorkspaceSelectorNew />
      <hr className={`${CLASS_NAME}__divider`} />
      <ProjectList
        projects={projectsList}
        handleProjectChange={setNewProject}
        workspaceId={currentWorkspace.id}
      />
      <hr className={`${CLASS_NAME}__divider`} />
      <ProjectSideBarFooter />
    </div>
  );
};

export default ProjectSideBar;
