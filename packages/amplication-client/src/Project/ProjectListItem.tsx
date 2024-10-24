import {
  Button,
  EnumButtonStyle,
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  EnumIconPosition,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  EnumTextWeight,
  FlexItem,
  HorizontalRule,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { EnumResourceType, Project } from "../models";

type Props = {
  project: Project;
  workspaceId: string;
};
const CLASS_NAME = "project-card";

export const ProjectListItem = ({ project, workspaceId }: Props) => {
  const services = useMemo(
    () =>
      project.resources.filter(
        (x) =>
          x.resourceType === EnumResourceType.Service ||
          x.resourceType === EnumResourceType.MessageBroker
      ),
    [project.resources]
  );

  return (
    <Link to={`/${workspaceId}/${project.id}`}>
      <Panel
        themeColor={EnumTextColor.Secondary}
        className={CLASS_NAME}
        panelStyle={EnumPanelStyle.Bordered}
        clickable
      >
        <FlexItem
          direction={EnumFlexDirection.Column}
          itemsAlign={EnumItemsAlign.Start}
          contentAlign={EnumContentAlign.Start}
          gap={EnumGapSize.Large}
          className={`${CLASS_NAME}__content`}
        >
          <FlexItem
            direction={EnumFlexDirection.Row}
            itemsAlign={EnumItemsAlign.Center}
            gap={EnumGapSize.Small}
            className={`${CLASS_NAME}__title`}
            end={
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={EnumTextColor.ThemeTurquoise}
              >
                {services?.length}{" "}
                {services?.length === 1 ? "Service" : "Services"}
              </Text>
            }
          >
            <Text
              textStyle={EnumTextStyle.H4}
              textWeight={EnumTextWeight.SemiBold}
            >
              {project.name}
            </Text>
          </FlexItem>
          <Text textStyle={EnumTextStyle.Description}>
            {project.description}
          </Text>

          <div className={`${CLASS_NAME}__actions-bar`}>
            <HorizontalRule />

            <FlexItem
              direction={EnumFlexDirection.Row}
              gap={EnumGapSize.Large}
              itemsAlign={EnumItemsAlign.Center}
            >
              <Link to={`/${workspaceId}/platform/${project.id}`}>
                <Button
                  buttonStyle={EnumButtonStyle.Outline}
                  icon="grid"
                  iconSize="small"
                  iconPosition={EnumIconPosition.Left}
                >
                  Platform
                </Button>
              </Link>
              <Link to={`/${workspaceId}/${project.id}`}>
                <Button
                  buttonStyle={EnumButtonStyle.Outline}
                  icon="code"
                  iconSize="small"
                  iconPosition={EnumIconPosition.Left}
                >
                  Catalog
                </Button>
              </Link>
            </FlexItem>
          </div>
        </FlexItem>
      </Panel>
    </Link>
  );
};
