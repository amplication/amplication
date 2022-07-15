import React from "react";
import { Project, Workspace } from "../models";
import ProjectList from "./ProjectList";
import "./ProjectSideBar.scss";
import ProjectSideBarFooter from "./ProjectSideBarFooter";
import WorkspaceSelectorNew from "./WorkspaceSelectorNew";

const CLASS_NAME = "side-bar-layout";

type Props = {
  currentWorkspace: Workspace;
  currentProject: Project;
  projects: Project[];
  onProjectChange: (project: Project) => void;
  onCreateNewProjectClicked: () => void;
  onSetCurrentWorkspace: (workspaceId: string) => void;
};

const SideBar = ({
  currentWorkspace,
  currentProject,
  projects,
  onProjectChange,
  onCreateNewProjectClicked,
  onSetCurrentWorkspace,
}: Props) => {
  return (
    <div className={CLASS_NAME}>
      <span className={`${CLASS_NAME}__label`}>Workspace</span>
        <WorkspaceSelectorNew />
      <div className={`${CLASS_NAME}__inner`}>
        <ProjectList
          projects={projects}
          handleProjectChange={onProjectChange}
        />
      </div>
        <ProjectSideBarFooter />
    </div>
  );
};

export default SideBar;
