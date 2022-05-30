import React, { useCallback } from "react";
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

type Props = {
  applicationId: string;
};

const EVENT_DATA: TrackEvent = {
  eventName: "rolesTileClick",
};

function RolesTile({ applicationId }: Props) {
  const history = useHistory();

  const { data, loading } = useQuery<{
    appRoles: models.AppRole[];
  }>(GET_ROLES, {
    variables: {
      id: applicationId,
    },
  });
  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(`/${applicationId}/roles`);
    },
    [history, trackEvent, applicationId]
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
            {data?.appRoles.length}
            {data?.appRoles.length > 1 ? " roles" : " role"}
          </>
        )
      }
      message="Create roles and define permissions. Whether at the Entity level or the Field level, granularity is key."
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Outline}
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
