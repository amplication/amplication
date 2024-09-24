import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import { Project } from "../models";
import { pluralize } from "../util/pluralize";
import ProjectEmptyState from "./ProjectEmptyState";
import "./ProjectList.scss";
import { ProjectListItem } from "./ProjectListItem";

type Props = {
  projects: Project[] | null;
  workspaceId: string;
};

export const ProjectList = ({ projects, workspaceId }: Props) => {
  return (
    <>
      <FlexItem margin={EnumFlexItemMargin.Bottom}>
        <Text textStyle={EnumTextStyle.Tag}>
          {projects.length} {pluralize(projects.length, "Project", "Projects")}
        </Text>
      </FlexItem>

      <div className="project-list">
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
      </div>
    </>
  );
};

export default ProjectList;
