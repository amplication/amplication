import { useQuery } from "@apollo/client";
import React from "react";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import AppGitStatusPanel from "../Application/git/AppGitStatusPanel";
import { GET_APP_GIT_REPOSITORY } from "./git/SyncWithGithubPage";
import { App } from "../models";
type Props = {
  applicationId: string;
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

function SyncWithGithubTile({ applicationId }: Props) {
  const { data } = useQuery<{ app: App }>(GET_APP_GIT_REPOSITORY, {
    variables: {
      appId: applicationId,
    },
  });

  return (
    <OverviewSecondaryTile
      icon="github"
      title="Sync with GitHub"
      message="Push the Amplication-generated app to your GitHub repo. Track changes, track our code. You are in full control of your app."
      footer={
        data?.app && (
          <AppGitStatusPanel app={data?.app} showDisconnectedMessage={false} />
        )
      }
    />
  );
}

export default SyncWithGithubTile;
