import { gql, useQuery } from "@apollo/client";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Event as TrackEvent, useTracking } from "../util/analytics";
import GithubTileFooter from "./GithubTileFooter";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

type Props = {
  applicationId: string;
};

const EVENT_DATA: TrackEvent = {
  eventName: "syncWithGitHubTileClick",
};

export type GitRepository = {
  id: string;
  name: string;
  gitOrganization: {
    id: string;
    name: string;
  };
  githubLastSync: string;
};

type TData = {
  app: {
    id: string;
    gitRepository: GitRepository;
  };
};

function SyncWithGithubTile({ applicationId }: Props) {
  const history = useHistory();
  const { data, loading } = useQuery<TData>(GET_GIT_REPOSITORY_FROM_APP_ID, {
    variables: {
      id: applicationId,
    },
  });

  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(`/${applicationId}/github`);
    },
    [history, trackEvent, applicationId]
  );

  return (
    <OverviewSecondaryTile
      icon="github"
      title="Sync with GitHub"
      message="Push the Amplication-generated app to your GitHub repo. Track changes, track our code. You are in full control of your app."
      footer={
        <GithubTileFooter
          gitRepository={data?.app?.gitRepository}
          loading={loading}
        />
      }
      onClick={handleClick}
    />
  );
}

export default SyncWithGithubTile;

const GET_GIT_REPOSITORY_FROM_APP_ID = gql`
  query getApplication($id: String!) {
    app(where: { id: $id }) {
      id
      gitRepository {
        id
        name
        gitOrganization {
          id
          name
        }
        githubLastSync
      }
    }
  }
`;
