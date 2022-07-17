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
  projects: Project[];
  handleProjectChange: (project: Project) => void;
  onCreateNewProjectClicked: () => void;
  onSetCurrentWorkspace: (workspaceId: string) => void;
};

// mock project list until merging with Shimi
const projectListMock: Project[] = [
  { id: "1", name: "project-1", resources: [], createdAt: "", updatedAt: "" },
  { id: "2", name: "project-2", resources: [], createdAt: "", updatedAt: "" },
  { id: "3", name: "project-3", resources: [], createdAt: "", updatedAt: "" },
];

const workspaceMock: Workspace = {
  id: '1',
  createdAt: undefined,
  name: "",
  projects: [],
  updatedAt: undefined,
  users: []
}

const ProjectSideBar = ({
  currentWorkspace = workspaceMock,
  currentProject,
  projects = projectListMock,
  handleProjectChange,
  onCreateNewProjectClicked,
  onSetCurrentWorkspace,
}: Props) => {
  return (
    <div className={CLASS_NAME}>
      <span className={`${CLASS_NAME}__label`}>Workspace</span>
        <WorkspaceSelectorNew />
        <hr className={`${CLASS_NAME}__divider`} />
        <ProjectList
          projects={projects}
          handleProjectChange={handleProjectChange}
          workspaceId={currentWorkspace.id}

        />
        <hr className={`${CLASS_NAME}__divider`} />
        <ProjectSideBarFooter />
    </div>
  );
};

export default ProjectSideBar;
