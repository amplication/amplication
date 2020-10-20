import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import "@rmwc/snackbar/styles";
import { CircularProgress } from "@rmwc/circular-progress";

import * as models from "../models";
import { EnumPanelStyle, Panel, PanelHeader } from "../Components/Panel";

import { GET_LAST_BUILD } from "../VersionControl/LastBuild";
import "./CurrentBuildTile.scss";
import { Button, EnumButtonStyle } from "../Components/Button";
import publishImage from "../assets/images/tile-publish.svg";
import UserAndTime from "../Components/UserAndTime";
import { useTracking, Event as TrackEvent } from "../util/analytics";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "current-build-tile";

const EVENT_DATA: TrackEvent = {
  eventName: "currentBuildTileClick",
};

function CurrentBuildTile({ applicationId }: Props) {
  const history = useHistory();
  const { data, loading } = useQuery<{
    builds: models.Build[];
  }>(GET_LAST_BUILD, {
    variables: {
      appId: applicationId,
    },
  });

  const lastBuild = useMemo(() => {
    if (loading) return null;
    const [last] = data?.builds;
    return last;
  }, [loading, data]);

  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(`/${applicationId}/builds`);
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
      <PanelHeader className={`${CLASS_NAME}__title`}>
        <h2>
          Current Build
          {lastBuild && (
            <span className="version-number">{lastBuild?.version}</span>
          )}
        </h2>
      </PanelHeader>

      <div className={`${CLASS_NAME}__content`}>
        <div className={`${CLASS_NAME}__content__details`}>
          {loading ? (
            <CircularProgress />
          ) : !lastBuild ? (
            <>There are no builds yet</>
          ) : (
            <UserAndTime
              account={lastBuild?.createdBy?.account || {}}
              time={lastBuild?.createdAt}
            />
          )}
        </div>
        <img src={publishImage} alt="publish" />

        <Button
          buttonStyle={EnumButtonStyle.Secondary}
          className={`${CLASS_NAME}__content__action`}
        >
          Go To Page
        </Button>
      </div>
    </Panel>
  );
}

export default CurrentBuildTile;
