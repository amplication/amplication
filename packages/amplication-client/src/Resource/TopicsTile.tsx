import React, { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import * as models from "../models";
import {
  CircularProgress,
  Button,
  EnumButtonStyle,
} from "@amplication/design-system";

import { GET_ROLES } from "../Roles/RoleList";
import { useTracking, Event as TrackEvent } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import { AppContext } from "../context/appContext";

type Props = {
  resourceId: string;
};

const EVENT_DATA: TrackEvent = {
  eventName: "rolesTileClick",
};

function TopicsTile({ resourceId }: Props) {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const { data, loading } = useQuery<{
    resourceRoles: models.ResourceRole[];
  }>(GET_ROLES, {
    variables: {
      id: resourceId,
    },
  });
  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/roles`
      );
    },
    [history, trackEvent, resourceId, currentWorkspace, currentProject]
  );

  return (
    <OverviewSecondaryTile
      icon="topics_outline"
      title="Topics"
      headerExtra={
        loading ? (
          <CircularProgress centerToParent />
        ) : (
          <>
            {data?.resourceRoles.length}
            {data && data?.resourceRoles.length > 1 ? " topics" : " topic"}
          </>
        )
      }
      message="Create topics and define properties."
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Secondary}
          type="button"
          onClick={handleClick}
        >
          Go to topics
        </Button>
      }
    />
  );
}

export { TopicsTile };
