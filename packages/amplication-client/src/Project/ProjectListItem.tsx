import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";
import { Project } from "../models";

type Props = {
  project: Project;
  className: string;
  onProjectSelected: (project: Project) => void;
};

export const ProjectListItem = ({
  project,
  className,
  onProjectSelected,
}: Props) => {
  return (
    <InnerTabLink
      icon="file"
      to={`/${project.id}`}
      className={className}
      onClick={onProjectSelected} // if handleOnClick is needed instead of "to"
    >
      {project.name}
    </InnerTabLink>
  );
};
