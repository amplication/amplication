import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";
import { Project } from "../models";
import { Tooltip } from "@amplication/ui/design-system";
import { TRUNCATED_NAME_LENGTH, truncateName } from "../util/truncateName";

type Props = {
  project: Project;
  workspaceId: string;
};

export const ProjectListItem = ({ project, workspaceId }: Props) => {
  return (
    <Tooltip
      direction={"s"}
      noDelay
      wrap
      show={project.name?.length > TRUNCATED_NAME_LENGTH}
      aria-label={`${project.name}`}
    >
      <InnerTabLink icon="file" to={`/${workspaceId}/${project.id}`}>
        {truncateName(project.name)}
      </InnerTabLink>
    </Tooltip>
  );
};
