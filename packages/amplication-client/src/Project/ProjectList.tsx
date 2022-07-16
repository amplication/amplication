import React from "react";
import { Project } from "../models";
import AddNewProject from "./AddNewProject";
import "./ProjectList.scss";
import { ProjectListItem } from "./ProjectListItem";

const CLASS_NAME = "project-list";

type Props = {
  projects: Project[];
  HandleProjectChange: (project: Project) => void;
  onCreateNewProjectClicked: () => void;
};

export const ProjectList = ({ projects, HandleProjectChange }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__items`}>
        {projects.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            className={`${CLASS_NAME}__item`}
            onProjectSelected={HandleProjectChange}
          />
        ))}
      </div>
      <AddNewProject />
    </div>
  );
};

export default ProjectList;
