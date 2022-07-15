import React from "react";
import { Project, Workspace } from "../models";
import "./ProjectSideBar.scss";

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
      <p className={`${CLASS_NAME}__label`}>Workspace</p>
      <div className={`${CLASS_NAME}__inner`} />
    </div>
  );
};

export default SideBar;
