import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Panel, EnumPanelStyle } from "@amplication/design-system";

import { Button, EnumButtonStyle } from "../Components/Button";
import imageChanges from "../assets/images/sync-with-github-no-margin.svg";
import { GET_APPLICATION } from "../Application/ApplicationHome";

import * as models from "../models";
import { useTracking, Event as TrackEvent } from "../util/analytics";
import "./SyncWithGithubTile.scss";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "sync-with-github-tile";

const EVENT_DATA: TrackEvent = {
  eventName: "syncWithGitHubTileClick",
};

function SyncWithGithubTile({ applicationId }: Props) {
  const history = useHistory();
  const { data } = useQuery<{
    app: models.App;
  }>(GET_APPLICATION, {
    variables: {
      id: applicationId,
    },
  });

  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(`/${applicationId}/settings`);
    },
    [history, trackEvent, applicationId]
  );

  return (
    <Panel className={`${CLASS_NAME}`} clickable onClick={handleClick}>
      <div className={`${CLASS_NAME}__content`}>
        <div className={`${CLASS_NAME}__content__details`}>
          <h2>Sync with GitHub</h2>
          {!data?.app.githubSyncEnabled ? (
            <>You are not connected to a GitHub repository</>
          ) : (
            <>
              You are connected to
              <div className={`${CLASS_NAME}__repo-name`}>
                {data?.app.githubRepo}
              </div>
            </>
          )}
          <Button
            className={`${CLASS_NAME}__content__action`}
            buttonStyle={EnumButtonStyle.Primary}
          >
            {!data?.app.githubSyncEnabled
              ? "Setup Sync with GitHub"
              : "View Settings"}
          </Button>
        </div>
        <img src={imageChanges} alt="publish" />
      </div>
    </Panel>
  );
}

export default SyncWithGithubTile;
