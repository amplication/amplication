import React from "react";
import { Project } from "../models";
import "./ProjectList.scss";
import { ProjectListItem } from "./ProjectListItem";

const CLASS_NAME = "project-list";

type Props = {
  projects: Project[];
  
};

export const ProjectList = ({
  projects
}: Props) => {
  return (
    <div className={CLASS_NAME}>
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </div>
  );
};
