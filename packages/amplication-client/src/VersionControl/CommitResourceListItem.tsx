import { EnumPanelStyle, Icon, Panel } from "@amplication/design-system";
import { groupBy } from "lodash";
import React, { useCallback, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { ClickableId } from "../Components/ClickableId";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { AppContext } from "../context/appContext";
import { Build, Maybe, PendingChange } from "../models";
import { BuildStatusIcons } from "./BuildStatusIcons";
import "./CommitResourceListItem.scss";

const CLASS_NAME = "commit-resource-list-item";

type Props = {
  build: Build;
  changes: Maybe<PendingChange[]> | undefined;
};

const CommitResourceListItem = ({ build, changes }: Props) => {
  const { currentWorkspace, currentProject } = useContext(
    AppContext
  );

  const handleBuildLinkClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const resourceChangesCount = useMemo(() => {
    const changesByResource = groupBy(changes, (originChange) => {
      if (!originChange.origin.resource) return;
      return originChange.origin.resource.id
    });
    const resourcesChanges =  Object.entries(changesByResource).map(([resourceId, changes]) => {
      return {
        resourceId,
        changes
      }
    });
  
    return resourcesChanges.find((resourceChanges) => resourceChanges.resourceId === build.resource.id)?.changes.length;
  }, [build.resource.id, changes]);
  

  return (
    <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Bordered}>
      <div className={`${CLASS_NAME}__row`}>
        {build && (
          <>
            <div className={`${CLASS_NAME}__title`}>
              <ResourceCircleBadge type={build.resource.resourceType} />
              <p>{build.resource.name}</p>
              <Link
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resource.id}`}
              >
                <Icon icon="link" size="xsmall" />
              </Link>
            </div>

            <ClickableId
              label="Build ID"
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resource.id}/builds/${build.id}`}
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
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resource.id}/changes`}
          className={`${CLASS_NAME}__changes-count`}
        >
          {resourceChangesCount && resourceChangesCount > 0 ? resourceChangesCount : 0} changes
        </Link>

        <Link
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resource.id}/builds/${build.id}`}
        >
          view log
        </Link>
        <BuildStatusIcons build={build} />
      </div>
    </Panel>
  );
};

export default CommitResourceListItem;
