import { EnumPanelStyle, Icon, Panel } from "@amplication/design-system";
import React, { useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { ClickableId } from "../Components/ClickableId";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { AppContext } from "../context/appContext";
import { Build } from "../models";
import { BuildStatusIcons } from "./BuildStatusIcons";
import "./CommitResourceListItem.scss";

const CLASS_NAME = "commit-resource-list-item";

type Props = {
  build: Build;
};

const CommitResourceListItem = ({ build }: Props) => {
  const { currentWorkspace, currentProject, pendingChanges } = useContext(
    AppContext
  );

  const handleBuildLinkClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

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
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resource.id}/commits/builds/${build.id}`}
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
          to={`/${currentWorkspace?.id}/${currentProject?.id}/pending-changes`}
          className={`${CLASS_NAME}__changes-count`}
        >
          {pendingChanges.length} changes
        </Link>

        <Link
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}/commits/builds/${build.id}`}
        >
          view log
        </Link>
        <BuildStatusIcons build={build} />
      </div>
    </Panel>
  );
};

export default CommitResourceListItem;
