import React from "react";
import { Project } from "../models";
import "./ProjectList.scss";
import { ProjectListItem } from "./ProjectListItem";
import ProjectEmptyState from "./ProjectEmptyState";
import { List } from "@amplication/ui/design-system";

const CLASS_NAME = "project-list";

type Props = {
  projects: Project[] | null;
  workspaceId: string;
};

export const ProjectList = ({ projects, workspaceId }: Props) => {
  return (
    <div className={CLASS_NAME}>
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
