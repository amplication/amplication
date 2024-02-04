import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Icon,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { AppContext } from "../context/appContext";
import { Build } from "../models";
import { CommitChangesByResource } from "./hooks/useCommits";
import useBuildWatchStatus from "./useBuildWatchStatus";
import "./CommitResourceListItem.scss";
import { resourceThemeMap } from "../Resource/constants";
import { TruncatedId } from "../Components/TruncatedId";

type Props = {
  build: Build;
  commitChangesByResource: CommitChangesByResource;
};

const CLASS_NAME = "commit-resource-list-item";

const CommitResourceListItem = ({ build, commitChangesByResource }: Props) => {
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const { data } = useBuildWatchStatus(build);
  const handleBuildLinkClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const resourceChangesCount = useMemo(() => {
    const resourcesChanges = commitChangesByResource(build.commitId);
    return resourcesChanges.find(
      (resourceChanges) => resourceChanges.resourceId === build.resourceId
    )?.changes.length;
  }, [build.commitId, build.resourceId, commitChangesByResource]);

  return (
    build &&
    build.resource && (
      <ListItem gap={EnumGapSize.Default} className={CLASS_NAME}>
        <Link
          to={`/${currentWorkspace?.id}/${currentProject?.id}/commits/${build.commitId}/builds/${build.id}`}
          style={{ width: "100%" }}
        >
          <FlexItem
            itemsAlign={EnumItemsAlign.Center}
            className={`${CLASS_NAME}__title-row`}
          >
            <FlexItem.FlexStart
              className={`${CLASS_NAME}__title-row__resource-icon`}
            >
              <ResourceCircleBadge
                type={build.resource.resourceType}
                size="small"
              />
            </FlexItem.FlexStart>
            <Text className={`${CLASS_NAME}__title-row__title`}>
              {build.resource.name}
            </Text>
            <FlexItem.FlexEnd>
              <Icon
                icon="chevron_right"
                color={EnumTextColor.White}
                size="xsmall"
              />
            </FlexItem.FlexEnd>
          </FlexItem>
        </Link>
        <FlexItem
          direction={EnumFlexDirection.Column}
          gap={EnumGapSize.Small}
          className={`${CLASS_NAME}__description-row`}
        >
          <HorizontalRule smallSpacing />
          <FlexItem
            itemsAlign={EnumItemsAlign.Center}
            end={
              <FlexItem itemsAlign={EnumItemsAlign.Center}>
                <Link
                  to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}/changes/${build.commitId}`}
                >
                  <FlexItem
                    gap={EnumGapSize.Small}
                    itemsAlign={EnumItemsAlign.Center}
                  >
                    <Icon
                      icon="history_commit_outline"
                      color={EnumTextColor.ThemeTurquoise}
                    />
                    <Text textColor={EnumTextColor.ThemeTurquoise}>
                      {resourceChangesCount && resourceChangesCount > 0
                        ? resourceChangesCount
                        : 0}{" "}
                      changes
                    </Text>
                  </FlexItem>
                </Link>
                <hr className={`${CLASS_NAME}__vertical_border`} />
                <Link
                  to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}`}
                >
                  <FlexItem
                    gap={EnumGapSize.Small}
                    itemsAlign={EnumItemsAlign.Center}
                  >
                    <Icon
                      icon={
                        resourceThemeMap[build.resource?.resourceType]?.icon
                      }
                      color={EnumTextColor.ThemeTurquoise}
                    />
                    <Text textColor={EnumTextColor.ThemeTurquoise}>
                      Resource overview
                    </Text>
                  </FlexItem>
                </Link>
              </FlexItem>
            }
          >
            <span>
              <Text textStyle={EnumTextStyle.Tag}>Build ID </Text>
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={EnumTextColor.White}
              >
                <TruncatedId id={build.id} />
              </Text>
            </span>
          </FlexItem>
        </FlexItem>
      </ListItem>
    )
  );
};

export default CommitResourceListItem;
