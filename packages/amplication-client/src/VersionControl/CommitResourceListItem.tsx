import { EnumPanelStyle, Icon, Panel } from "@amplication/design-system";
import React, { useCallback, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { ClickableId } from "../Components/ClickableId";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { AppContext } from "../context/appContext";
import { Build } from "../models";
import { BuildStatusIcons } from "./BuildStatusIcons";
import "./CommitResourceListItem.scss";
import useCommits from "./hooks/useCommits";

const CLASS_NAME = "commit-resource-list-item";

type Props = {
  build: Build;
};

const CommitResourceListItem = ({ build }: Props) => {
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const { commitChangesByResource } = useCommits();

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
    <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Bordered}>
      <div className={`${CLASS_NAME}__row`}>
        {build && build.resource && (
          <>
            <div className={`${CLASS_NAME}__title`}>
              {build.resource && (
                <ResourceCircleBadge type={build.resource.resourceType} />
              )}
              <p>{build.resource?.name}</p>
              <Link
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}`}
              >
                <Icon icon="link" size="xsmall" />
              </Link>
            </div>

            <ClickableId
              label="Build ID"
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}/builds/${build.id}`}
              id={build.id}
              onClick={handleBuildLinkClick}
              eventData={{
                eventName: "commitListBuildIdClick",
              }}
            />
          </>
        )}
      </div>
      <hr className={`${CLASS_NAME}__divider`} />
      <div className={`${CLASS_NAME}__row`}>
        <Link
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}/changes/${build.commitId}`}
          className={`${CLASS_NAME}__changes-count`}
        >
          {resourceChangesCount && resourceChangesCount > 0
            ? resourceChangesCount
            : 0}{" "}
          changes
        </Link>

        <Link
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}/builds/${build.id}`}
        >
          view log
        </Link>
        <BuildStatusIcons build={build} />
      </div>
    </Panel>
  );
};

export default CommitResourceListItem;
