import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import { isEmpty } from "lodash";

import * as models from "../models";
import { EnumPanelStyle, Panel, UserAndTime } from "@amplication/design-system";

import { GET_LAST_COMMIT } from "../VersionControl/LastCommit";
import "./LastCommitTile.scss";
import { Button, EnumButtonStyle } from "../Components/Button";
import publishImage from "../assets/images/tile-publish.svg";
import { useTracking, Event as TrackEvent } from "../util/analytics";
import { ClickableId } from "../Components/ClickableId";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "last-commit-tile";

const EVENT_DATA: TrackEvent = {
  eventName: "lastCommitTileClick",
};

function LastCommitTile({ applicationId }: Props) {
  const history = useHistory();
  const { data, loading } = useQuery<{
    commits: models.Commit[];
  }>(GET_LAST_COMMIT, {
    variables: {
      applicationId,
    },
  });

  const lastCommit = useMemo(() => {
    if (loading || isEmpty(data?.commits)) return null;
    const [last] = data?.commits;
    return last;
  }, [loading, data]);

  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(`/${applicationId}/commits/${lastCommit.id}`);
    },
    [history, trackEvent, applicationId, lastCommit]
  );

  return (
    <Panel className={`${CLASS_NAME}`} clickable onClick={handleClick}>
      <div className={`${CLASS_NAME}__content`}>
        <div className={`${CLASS_NAME}__content__details`}>
          <h2>
            Last Commit
            {lastCommit && (
              <ClickableId
                to={`/${applicationId}/commits/${lastCommit.id}`}
                id={lastCommit.id}
                label=""
                eventData={{
                  eventName: "lastCommitTileIdClick",
                }}
              />
            )}
          </h2>
          {loading ? (
            <CircularProgress />
          ) : !lastCommit ? (
            <>There are no builds yet</>
          ) : (
            <UserAndTime
              account={lastCommit?.user?.account || {}}
              time={lastCommit?.createdAt}
            />
          )}{" "}
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            className={`${CLASS_NAME}__content__action`}
          >
            View Details
          </Button>
        </div>
        <img src={publishImage} alt="publish" />
      </div>
    </Panel>
  );
}

export default LastCommitTile;
