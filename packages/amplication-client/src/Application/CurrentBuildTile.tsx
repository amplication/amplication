import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import "@rmwc/snackbar/styles";
import { CircularProgress } from "@rmwc/circular-progress";
import { isEmpty } from "lodash";

import * as models from "../models";
import { EnumPanelStyle, Panel, UserAndTime } from "@amplication/design-system";

import { GET_LAST_BUILD } from "../VersionControl/LastBuild";
import "./CurrentBuildTile.scss";
import { Button, EnumButtonStyle } from "../Components/Button";
import publishImage from "../assets/images/tile-publish.svg";
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
    if (loading || isEmpty(data?.builds)) return null;
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
      <div className={`${CLASS_NAME}__content`}>
        <div className={`${CLASS_NAME}__content__details`}>
          <h2>
            Current Build
            {lastBuild && (
              <span className="version-number">{lastBuild?.version}</span>
            )}
          </h2>
          {loading ? (
            <CircularProgress />
          ) : !lastBuild ? (
            <>There are no builds yet</>
          ) : (
            <UserAndTime
              account={lastBuild?.createdBy?.account || {}}
              time={lastBuild?.createdAt}
            />
          )}{" "}
          <Button
            buttonStyle={EnumButtonStyle.Secondary}
            className={`${CLASS_NAME}__content__action`}
          >
            Go To Page
          </Button>
        </div>
        <img src={publishImage} alt="publish" />
      </div>
    </Panel>
  );
}

export default CurrentBuildTile;
