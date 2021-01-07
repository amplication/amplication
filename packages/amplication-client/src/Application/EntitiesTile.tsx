import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import "@rmwc/snackbar/styles";
import { CircularProgress } from "@rmwc/circular-progress";

import * as models from "../models";
import { EnumPanelStyle, Panel } from "@amplication/design-system";

import { GET_ENTITIES } from "../Entity/EntityList";
import { Button, EnumButtonStyle } from "../Components/Button";
import imageEntities from "../assets/images/tile-entities.svg";
import "./EntitiesTile.scss";
import { useTracking, Event as TrackEvent } from "../util/analytics";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "entities-tile";

const EVENT_DATA: TrackEvent = {
  eventName: "entitiesTileClick",
};

function EntitiesTile({ applicationId }: Props) {
  const history = useHistory();
  const { data, loading } = useQuery<{
    entities: models.Entity[];
  }>(GET_ENTITIES, {
    variables: {
      id: applicationId,
    },
  });

  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(`/${applicationId}/entities`);
    },
    [history, trackEvent, applicationId]
  );

  return (
    <Panel
      className={`${CLASS_NAME}`}
      panelStyle={EnumPanelStyle.Bordered}
      clickable
      onClick={handleClick}
    >
      <div className={`${CLASS_NAME}__content`}>
        <div className={`${CLASS_NAME}__content__details`}>
          <h2>Entities</h2>
          {loading ? (
            <CircularProgress />
          ) : !data?.entities.length ? (
            <>There are no entities</>
          ) : (
            <>
              You have {data?.entities.length}
              {data?.entities.length > 1 ? " entities" : " entity"}
            </>
          )}
          <Button
            buttonStyle={EnumButtonStyle.Secondary}
            className={`${CLASS_NAME}__content__action`}
          >
            Create Entities
          </Button>
        </div>

        <img src={imageEntities} alt="entities" />
      </div>
    </Panel>
  );
}

export default EntitiesTile;
