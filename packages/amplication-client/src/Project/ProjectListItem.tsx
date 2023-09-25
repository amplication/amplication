import {
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextStyle,
  EnumTextWeight,
  FlexItem,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { AppContext } from "../context/appContext";
import { EnumResourceType, Project } from "../models";

type Props = {
  project: Project;
  workspaceId: string;
};

export const ProjectListItem = ({ project, workspaceId }: Props) => {
  const history = useHistory();
  const { currentWorkspace } = useContext(AppContext);

  const handleClick = useCallback(() => {
    history.push(`/${currentWorkspace?.id}/${project.id}`);
  }, [history, currentWorkspace]);

  return (
    <ListItem showDefaultActionIcon={true} onClick={handleClick}>
      <Link to={`/${workspaceId}/${project.id}`}>
        <Text
          textStyle={EnumTextStyle.Normal}
          textWeight={EnumTextWeight.SemiBold}
        >
          {project.name}
        </Text>
      </Link>

      <Text textStyle={EnumTextStyle.Subtle}>{project.description}</Text>
      <FlexItem margin={EnumFlexItemMargin.Top}>
        {project.resources.map(
          (resource) =>
            resource.resourceType !== EnumResourceType.ProjectConfiguration && (
              <>
                <Link
                  onClick={(e) => e.stopPropagation()}
                  key={resource.id}
                  to={`/${workspaceId}/${project.id}/${resource.id}`}
                >
                  <FlexItem itemsAlign={EnumItemsAlign.Center}>
                    <ResourceCircleBadge
                      type={resource.resourceType}
                      size="xsmall"
                    />
                    <Text textStyle={EnumTextStyle.Tag}>{resource.name}</Text>
                  </FlexItem>
                </Link>
              </>
            )
        )}
      </FlexItem>
    </ListItem>
  );
};
