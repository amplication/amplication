import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";
import { Project } from "../models";

type Props = {
  project: Project;
  workspaceId: string;
};

export const ProjectListItem = ({ project, workspaceId }: Props) => {
  return (
    <InnerTabLink icon="file" to={`/${workspaceId}/${project.id}`}>
      {project.name}
    </InnerTabLink>
  );
};
