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

function RolesTile({ resourceId }: Props) {
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
      history.push(`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/roles`);
    },
    [history, trackEvent, resourceId,currentWorkspace,currentProject]
  );

  return (
    <OverviewSecondaryTile
      icon="roles_outline"
      title="Roles"
      headerExtra={
        loading ? (
          <CircularProgress />
        ) : (
          <>
            {data?.resourceRoles.length}
            {data && data?.resourceRoles.length > 1 ? " roles" : " role"}
          </>
        )
      }
      message="Create roles and define permissions. Whether at the Entity level or the Field level, granularity is key."
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Secondary}
          type="button"
          onClick={handleClick}
        >
          Go to roles
        </Button>
      }
    />
  );
}

export default RolesTile;
