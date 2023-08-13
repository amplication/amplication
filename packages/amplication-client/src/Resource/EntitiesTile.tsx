import React, { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import * as models from "../models";
import {
  CircularProgress,
  Button,
  EnumButtonStyle,
} from "@amplication/ui/design-system";

import { GET_ENTITIES } from "../Entity/EntityList";
import { useTracking } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import { AppContext } from "../context/appContext";
import { AnalyticsEventNames } from "../util/analytics-events.types";

type Props = {
  resourceId: string;
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

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.EntitiesTileClick });
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities`
    );
  }, [history, trackEvent, resourceId, currentWorkspace, currentProject]);

  return (
    <OverviewSecondaryTile
      icon="database"
      title="Entities"
      headerExtra={
        loading ? (
          <CircularProgress centerToParent />
        ) : (
          <>
            {data?.entities.length}
            {data && data?.entities.length > 1 ? " entities" : " entity"}
          </>
        )
      }
      message="Use Amplication's simple and intuitive user interface to define your data model."
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
