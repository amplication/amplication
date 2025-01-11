import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  List,
  ListItem,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CodeGeneratorImage } from "../Components/CodeGeneratorImage";
import { TruncatedId } from "../Components/TruncatedId";
import { Build, EnumBuildStatus } from "../models";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import BuildGitLink from "./BuildGitLink";
import { CommitBuildsStatusIcon } from "./CommitBuildsStatusIcon";
import "./CommitResourceListItem.scss";
import useBuildWatchStatus from "./useBuildWatchStatus";
import { ChangesByResource } from "./hooks/useCommitChanges";

type Props = {
  build: Build;
  commitChangesByResource: ChangesByResource;
};

const CLASS_NAME = "commit-resource-list-item";

const CommitResourceListItem = ({ build, commitChangesByResource }: Props) => {
  const { data } = useBuildWatchStatus(build);
  const { baseUrl } = useProjectBaseUrl();

  const resourceChangesCount = useMemo(() => {
    return commitChangesByResource.find(
      (resourceChanges) => resourceChanges.resourceId === build.resourceId
    )?.changes.length;
  }, [build.resourceId, commitChangesByResource]);

  const logMessage = useMemo(() => {
    if (data.build.status === EnumBuildStatus.Failed) {
      return (
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.ThemeRed}>
          Error. See logs for details
        </Text>
      );
    }

    const lastStep = build.action.steps[build.action.steps.length - 1];
    if (!lastStep) {
      return <></>;
    }
    return (
      <Text textStyle={EnumTextStyle.Tag}>
        {lastStep.logs[lastStep.logs.length - 1]?.message}
      </Text>
    );
  }, [build.action.steps, data.build.status]);

  return (
    build &&
    build.resource && (
      <Panel panelStyle={EnumPanelStyle.Transparent}>
        <List>
          <ListItem
            gap={EnumGapSize.None}
            className={CLASS_NAME}
            removeDefaultPadding
          >
            <Link
              to={`${baseUrl}/commits/${build.commitId}/builds/${build.id}`}
              className={`${CLASS_NAME}__link`}
            >
              <FlexItem itemsAlign={EnumItemsAlign.Center}>
                <FlexItem.FlexStart>
                  <FlexItem
                    itemsAlign={EnumItemsAlign.Center}
                    direction={EnumFlexDirection.Row}
                  >
                    <CommitBuildsStatusIcon
                      commitBuildStatus={data.build.status}
                    />
                    <Text textStyle={EnumTextStyle.Tag}>Build ID </Text>
                    <Text
                      textStyle={EnumTextStyle.Tag}
                      textColor={EnumTextColor.White}
                    >
                      <TruncatedId id={build.id} />
                    </Text>
                  </FlexItem>
                </FlexItem.FlexStart>
                <Text textStyle={EnumTextStyle.Normal}>
                  {build.resource.name}
                </Text>
                <CodeGeneratorImage resource={build.resource} />
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
              <FlexItem
                itemsAlign={EnumItemsAlign.Center}
                direction={EnumFlexDirection.Row}
                end={
                  <FlexItem itemsAlign={EnumItemsAlign.Center}>
                    <Link
                      to={`${baseUrl}/commits/${build.commitId}/builds/${build.id}`}
                    >
                      {logMessage}
                    </Link>
                    <BuildGitLink
                      build={build}
                      textColor={EnumTextColor.ThemeTurquoise}
                    />
                  </FlexItem>
                }
              >
                <Link
                  to={`${baseUrl}/${build.resourceId}/changes/${build.commitId}`}
                >
                  <FlexItem
                    gap={EnumGapSize.Small}
                    itemsAlign={EnumItemsAlign.Center}
                  >
                    <Icon
                      icon="history_commit_outline"
                      color={EnumTextColor.ThemeTurquoise}
                      size="xsmall"
                    />
                    <Text
                      textColor={EnumTextColor.ThemeTurquoise}
                      textStyle={EnumTextStyle.Subtle}
                    >
                      {resourceChangesCount && resourceChangesCount > 0
                        ? resourceChangesCount
                        : 0}{" "}
                      changes
                    </Text>
                  </FlexItem>
                </Link>
              </FlexItem>
            </FlexItem>
          </ListItem>
        </List>
      </Panel>
    )
  );
};

export default CommitResourceListItem;
