import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";
import { Project } from "../models";
import "./ProjectList.scss";

type Props = {
  projects: Project[];
  onProjectChange: (project: Project) => void;
  onCreateNewProjectClicked: () => void;
};

export const ProjectList = ({
  projects,
  onProjectChange,
  onCreateNewProjectClicked,
}: Props) => {
  return (
    <div>
      {projects.map((project) => (
        <InnerTabLink key={project.id} icon="file" to="">
          {project.name}
        </InnerTabLink>
      ))}
    </div>
  );
};
