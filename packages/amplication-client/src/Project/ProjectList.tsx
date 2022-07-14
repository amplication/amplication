import React from "react";
import { Project } from "../models";
import "./ProjectList.scss";
import { ProjectListItem } from "./ProjectListItem";

type Props = {
  projects: Project[];
  
};

export const ProjectList = ({
  projects
}: Props) => {
  return (
    <div>
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </div>
  );
};
