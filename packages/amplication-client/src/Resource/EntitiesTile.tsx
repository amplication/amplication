import React, { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import * as models from "../models";
import {
  CircularProgress,
  Button,
  EnumButtonStyle,
} from "@amplication/design-system";

import { GET_ENTITIES } from "../Entity/EntityList";
import { useTracking, Event as TrackEvent } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import { AppContext } from "../context/appContext";

type Props = {
  resourceId: string;
};

const EVENT_DATA: TrackEvent = {
  eventName: "entitiesTileClick",
};

function EntitiesTile({ resourceId }: Props) {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const { data, loading } = useQuery<{
    entities: models.Entity[];
  }>(GET_ENTITIES, {
    variables: {
      id: resourceId,
    },
  });

  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities`
      );
    },
    [history, trackEvent, resourceId, currentWorkspace, currentProject]
  );

  return (
    <OverviewSecondaryTile
      icon="database"
      title="Entities"
      headerExtra={
        loading ? (
          <CircularProgress />
        ) : (
          <>
            {data?.entities.length}
            {data && data?.entities.length > 1 ? " entities" : " entity"}
          </>
        )
      }
      message="Define your own data model. Keep using the Amplication Console. It is here to help you out with its simple and intuitive interface."
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Secondary}
          type="button"
          onClick={handleClick}
        >
          Go to entities
        </Button>
      }
    />
  );
}

export default EntitiesTile;
