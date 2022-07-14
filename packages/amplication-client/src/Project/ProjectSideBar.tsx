import React from "react";
import { Project, Workspace } from "../models";
import { ProjectList } from "./ProjectList";
import WorkspaceSelector from "../Workspaces/WorkspaceSelector";
import "./ProjectSideBar.scss";
import { ProjectSideBarFooter } from "./ProjectSideBarFooter";
import AddNewProject from "./AddNewProject";

const CLASS_NAME = "side-bar-layout";

const ProjectsMock: Project[] = [
  { id: "1", name: "project-1", resources: [], createdAt: "", updatedAt: "" },
  { id: "1", name: "project-2", resources: [], createdAt: "", updatedAt: "" },
  { id: "1", name: "project-3", resources: [], createdAt: "", updatedAt: "" },
];

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
  projects = ProjectsMock;
  return (
    <div className={CLASS_NAME}>
        <p className={`${CLASS_NAME}__label`}>Workspace</p>
        <WorkspaceSelector />
        <ProjectList
          projects={projects}
          onProjectChange={onProjectChange}
          onCreateNewProjectClicked={onCreateNewProjectClicked}
        />
        <AddNewProject onAddNewProject={onCreateNewProjectClicked} />
        <ProjectSideBarFooter />
    </div>
  );
};

export default SideBar;
