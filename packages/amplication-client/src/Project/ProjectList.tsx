import React from "react";
import { Project } from "../models";
import AddNewProject from "./AddNewProject";
import "./ProjectList.scss";
import { ProjectListItem } from "./ProjectListItem";

const CLASS_NAME = "project-list";

type Props = {
  projects: Project[];
  handleProjectChange: (project: Project) => void;
  workspaceId: string;
};

export const ProjectList = ({
  projects,
  handleProjectChange,
  workspaceId,
}: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__items`}>
        {projects.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            onProjectSelected={handleProjectChange}
            workspaceId={workspaceId}
          />
        ))}
      </div>
      <AddNewProject />
    </div>
  );
};

export default ProjectList;
