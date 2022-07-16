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
  HandleProjectChange: (project: Project) => void;
  onCreateNewProjectClicked: () => void;
  onSetCurrentWorkspace: (workspaceId: string) => void;
};

// mock project list until merging with Shimi
const projectListMock: Project[] = [
  { id: "1", name: "project-1", resources: [], createdAt: "", updatedAt: "" },
  { id: "2", name: "project-2", resources: [], createdAt: "", updatedAt: "" },
  { id: "3", name: "project-3", resources: [], createdAt: "", updatedAt: "" },
];

const SideBar = ({
  currentWorkspace,
  currentProject,
  projects = projectListMock,
  HandleProjectChange,
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
          HandleProjectChange={HandleProjectChange}
          onCreateNewProjectClicked={onCreateNewProjectClicked}
        />
      </div>
        <ProjectSideBarFooter />
    </div>
  );
};

export default SideBar;
