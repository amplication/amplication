import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import "@rmwc/snackbar/styles";
import { CircularProgress } from "@rmwc/circular-progress";
import { Icon } from "@rmwc/icon";

import * as models from "../models";
import { Panel, EnumPanelStyle } from "@amplication/design-system";

import { GET_ENTITIES } from "../Entity/EntityList";
import { useTracking, Event as TrackEvent } from "../util/analytics";
import { SvgThemeImage, EnumImages } from "../Components/SvgThemeImage";
import "./EntitiesTile.scss";

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
      clickable
      onClick={handleClick}
      panelStyle={EnumPanelStyle.Bordered}
    >
      <div className={`${CLASS_NAME}__content`}>
        <div className={`${CLASS_NAME}__content__details`}>
          <h2>Entities</h2>
          Define the data model of you application with data entities and
          role‑based access.
          {loading ? (
            <CircularProgress />
          ) : (
            <span className={`${CLASS_NAME}__content__details__summary`}>
              <Icon icon={{ icon: "database", size: "medium" }} />

              {data?.entities.length}
              {data?.entities.length > 1 ? " entities" : " entity"}
            </span>
          )}
        </div>
        <SvgThemeImage image={EnumImages.Entities} />
      </div>
    </Panel>
  );
}

export default EntitiesTile;
