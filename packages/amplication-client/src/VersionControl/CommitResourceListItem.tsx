import { EnumPanelStyle, Icon, Panel } from "@amplication/ui/design-system";
import { useCallback, useContext, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { ClickableId } from "../Components/ClickableId";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { AppContext } from "../context/appContext";
import { Build } from "../models";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { CommitBuildsStatusIcon } from "./CommitBuildsStatusIcon";
import "./CommitResourceListItem.scss";
import { CommitChangesByResource } from "./hooks/useCommits";
import useBuildWatchStatus from "./useBuildWatchStatus";

const CLASS_NAME = "commit-resource-list-item";

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
    <NavLink
      to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}/builds/${build.id}`}
    >
      {build && build.resource && (
        <Panel
          className={CLASS_NAME}
          clickable
          panelStyle={EnumPanelStyle.Bordered}
        >
          <div className={`${CLASS_NAME}__row`}>
            <ResourceCircleBadge type={build.resource.resourceType} />

            <div className={`${CLASS_NAME}__title`}>
              <Link
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}`}
              >
                {build.resource.name}
                <Icon icon="link" size="xsmall" />
              </Link>
            </div>

            <span className="spacer" />
            <Link
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}/changes/${build.commitId}`}
              className={`${CLASS_NAME}__changes-count`}
            >
              {resourceChangesCount && resourceChangesCount > 0
                ? resourceChangesCount
                : 0}{" "}
              changes
            </Link>
          </div>
          <hr className={`${CLASS_NAME}__divider`} />
          <div className={`${CLASS_NAME}__row`}>
            <CommitBuildsStatusIcon commitBuildStatus={data.build.status} />
            <ClickableId
              label="Build ID"
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}/builds/${build.id}`}
              id={build.id}
              onClick={handleBuildLinkClick}
              eventData={{
                eventName: AnalyticsEventNames.CommitListBuildIdClick,
              }}
            />
          </div>
        </Panel>
      )}
    </NavLink>
  );
};

export default CommitResourceListItem;
