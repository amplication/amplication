import React, { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import * as models from "../models";
import {
  CircularProgress,
  Button,
  EnumButtonStyle,
} from "@amplication/design-system";

import { GET_TOPICS } from "../Topics/TopicList";
import { useTracking, Event as TrackEvent } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import { AppContext } from "../context/appContext";

type Props = {
  resourceId: string;
};

const EVENT_DATA: TrackEvent = {
  eventName: "rolesTileClick",
};

function ServicesTile({ resourceId }: Props) {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const { data, loading } = useQuery<{
    Topics: models.Topic[];
  }>(GET_TOPICS, {
    variables: {
      where: { resource: { id: resourceId } },
    },
  });
  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent(EVENT_DATA);
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/services`
    );
  }, [history, trackEvent, resourceId, currentWorkspace, currentProject]);

  return (
    <OverviewSecondaryTile
      icon="services_outline"
      title="Services"
      headerExtra={
        loading ? (
          <CircularProgress centerToParent />
        ) : (
          <>
            {data?.Topics.length}
            {data && data?.Topics.length > 1 ? " services" : " service"}
          </>
        )
      }
      message="See connected services."
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Secondary}
          type="button"
          onClick={handleClick}
        >
          Go to services
        </Button>
      }
    />
  );
}

export { ServicesTile };
