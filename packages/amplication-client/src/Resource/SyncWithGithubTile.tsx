import { useQuery } from "@apollo/client";
import React from "react";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import AppGitStatusPanel from "./git/AppGitStatusPanel";
import { GET_RESOURCE_GIT_REPOSITORY } from "./git/SyncWithGithubPage";
import { Resource } from "../models";
type Props = {
  resourceId: string;
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

function SyncWithGithubTile({ resourceId }: Props) {
  const { data } = useQuery<{ resource: Resource }>(
    GET_RESOURCE_GIT_REPOSITORY,
    {
      variables: {
        resourceId,
      },
    }
  );

  return (
    <OverviewSecondaryTile
      icon="github"
      title="Sync with GitHub"
      message="Push the Amplication-generated resource to your GitHub repo. Track changes, track our code. You are in full control of your resource."
      footer={
        data?.resource && (
          <AppGitStatusPanel
            resource={data?.resource}
            showDisconnectedMessage={false}
          />
        )
      }
    />
  );
}

export default SyncWithGithubTile;
