import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";
import { Project } from "../models";

type Props = {
  project: Project;
};

export const ProjectListItem = ({ project }: Props) => {
  return (
    <InnerTabLink icon="file" to={`/${project.id}`}>
      <span>{project.name}</span>
    </InnerTabLink>
  );
};
