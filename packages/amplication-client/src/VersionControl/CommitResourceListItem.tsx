import {
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { ClickableId } from "../Components/ClickableId";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { AppContext } from "../context/appContext";
import { Build } from "../models";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { CommitBuildsStatusIcon } from "./CommitBuildsStatusIcon";
import { CommitChangesByResource } from "./hooks/useCommits";
import useBuildWatchStatus from "./useBuildWatchStatus";
import BuildGitLink from "./BuildGitLink";

type Props = {
  build: Build;
  commitChangesByResource: CommitChangesByResource;
};

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
      <ListItem
        to={`/${currentWorkspace?.id}/${currentProject?.id}/commits/${build.commitId}/builds/${build.id}`}
      >
        <FlexItem itemsAlign={EnumItemsAlign.Center}>
          <FlexItem.FlexStart>
            <ResourceCircleBadge type={build.resource.resourceType} />
          </FlexItem.FlexStart>
          <Link
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}`}
          >
            <Text textStyle={EnumTextStyle.Normal}>{build.resource.name}</Text>
            <Icon icon="link" size="xsmall" />
          </Link>
          <FlexItem.FlexEnd>
            <Link
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}/changes/${build.commitId}`}
            >
              <Text
                textColor={EnumTextColor.White}
                underline={true}
                textStyle={EnumTextStyle.Tag}
              >
                {resourceChangesCount && resourceChangesCount > 0
                  ? resourceChangesCount
                  : 0}{" "}
                changes
              </Text>
            </Link>
          </FlexItem.FlexEnd>
        </FlexItem>
        <FlexItem
          margin={EnumFlexItemMargin.Top}
          itemsAlign={EnumItemsAlign.Center}
          end={<BuildGitLink build={build} textColor={EnumTextColor.Black20} />}
        >
          <CommitBuildsStatusIcon commitBuildStatus={data.build.status} />
          <ClickableId
            label="Build ID"
            to={`/${currentWorkspace?.id}/${currentProject?.id}/commits/${build.commitId}/builds/${build.id}`}
            id={build.id}
            onClick={handleBuildLinkClick}
            eventData={{
              eventName: AnalyticsEventNames.CommitListBuildIdClick,
            }}
          />
        </FlexItem>
      </ListItem>
    )
  );
};

export default CommitResourceListItem;
