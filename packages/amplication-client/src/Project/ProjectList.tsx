import React from "react";
import { Project } from "../models";
import { ProjectListItem } from "./ProjectListItem";
import ProjectEmptyState from "./ProjectEmptyState";
import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  List,
  Text,
} from "@amplication/ui/design-system";
import { pluralize } from "../util/pluralize";

const CLASS_NAME = "project-list";

type Props = {
  projects: Project[] | null;
  workspaceId: string;
};

export const ProjectList = ({ projects, workspaceId }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <FlexItem margin={EnumFlexItemMargin.Bottom}>
        <Text textStyle={EnumTextStyle.Tag}>
          {projects.length} {pluralize(projects.length, "Project", "Projects")}
        </Text>
      </FlexItem>
      <List>
        {projects.length ? (
          projects?.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              workspaceId={workspaceId}
            />
          ))
        ) : (
          <ProjectEmptyState />
        )}
      </List>
    </div>
  );
};

export default ProjectList;
