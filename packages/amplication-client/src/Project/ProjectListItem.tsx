import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";
import { Project } from "../models";

type Props = {
  project: Project;
  onProjectSelected: (project: Project) => void;
};

export const ProjectListItem = ({
  project,
  onProjectSelected,
}: Props) => {
  return (
    <InnerTabLink
      icon="file"
      to={`/${project.id}`}
      onClick={onProjectSelected} // if handleOnClick is needed instead of "to"
    >
      {project.name}
    </InnerTabLink>
  );
};
