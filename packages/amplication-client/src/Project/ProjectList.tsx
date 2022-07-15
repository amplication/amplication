import React from "react";
import { Project } from "../models";
import "./ProjectList.scss";
import { ProjectListItem } from "./ProjectListItem";

const CLASS_NAME = "project-list";

// mock project list until merging with Shimi
const projectListMock: Project[] = [
  { id: "1", name: "project-1", resources: [], createdAt: "", updatedAt: "" },
  { id: "2", name: "project-2", resources: [], createdAt: "", updatedAt: "" },
  { id: "3", name: "project-3", resources: [], createdAt: "", updatedAt: "" },
];

type Props = {
  projects: Project[];
  handleProjectChange: (project: Project) => void;
};

export const ProjectList = ({
  projects = projectListMock,
  handleProjectChange,
}: Props) => {
  return (
    <div className={CLASS_NAME}>
      {projects.map((project) => (
        <ProjectListItem
          key={project.id}
          project={project}
          className={`${CLASS_NAME}__item`}
          onProjectSelected={handleProjectChange}
        />
      ))}
    </div>
  );
};

export default ProjectList;
