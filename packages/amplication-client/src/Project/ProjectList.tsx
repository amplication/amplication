import React from "react";
import { Project } from "../models";
import AddNewProject from "./AddNewProject";
import "./ProjectList.scss";
import { ProjectListItem } from "./ProjectListItem";

const CLASS_NAME = "project-list";

type Props = {
  projects: Project[] | null;
  workspaceId: string;
};

export const ProjectList = ({ projects, workspaceId }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__items`}>
        {projects?.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            workspaceId={workspaceId}
          />
        ))}
      </div>
      <AddNewProject />
    </div>
  );
};

export default ProjectList;
