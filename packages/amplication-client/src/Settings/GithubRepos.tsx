import React, { useCallback } from "react";
import { Snackbar } from "@rmwc/snackbar";
import { gql, useQuery, useMutation, NetworkStatus } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import { CircularProgress } from "@rmwc/circular-progress";
import GithubRepoItem from "./GithubRepoItem";
import { Button, EnumButtonStyle } from "../Components/Button";
import "./GithubRepos.scss";

const CLASS_NAME = "github-repos";

type Props = {
  applicationId: string;
  onCompleted: () => void;
};

function GithubRepos({ applicationId, onCompleted }: Props) {
  const { data, error, loading, refetch, networkStatus } = useQuery<{
    appAvailableGithubRepos: models.GithubRepo[];
  }>(FIND_GITHUB_REPOS, {
    variables: {
      id: applicationId,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [enableSyncWithGithub, { error: errorUpdate }] = useMutation<
    models.App
  >(ENABLE_SYNC_WITH_GITHUB, {
    onCompleted: () => {
      onCompleted();
    },
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleRepoSelected = useCallback(
    (data: models.GithubRepo) => {
      enableSyncWithGithub({
        variables: {
          githubRepo: data.fullName,
          githubBranch: null,
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [enableSyncWithGithub, applicationId]
  );

  const errorMessage = formatError(error || errorUpdate);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <h3>Select a GitHub repository to sync your application with.</h3>
        {(loading || networkStatus === NetworkStatus.refetch) && (
          <CircularProgress />
        )}
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          onClick={handleRefresh}
          type="button"
          icon="refresh_cw"
          disabled={networkStatus === NetworkStatus.refetch}
        />
      </div>
      {data?.appAvailableGithubRepos.map((repo) => (
        <GithubRepoItem
          key={repo.fullName}
          repo={repo}
          onSelectRepo={handleRepoSelected}
        />
      ))}
      <Snackbar open={Boolean(error || errorUpdate)} message={errorMessage} />
    </div>
  );
}

export default GithubRepos;

const FIND_GITHUB_REPOS = gql`
  query appAvailableGithubRepos($id: String!) {
    appAvailableGithubRepos(where: { app: { id: $id } }) {
      name
      url
      private
      fullName
      admin
    }
  }
`;

const ENABLE_SYNC_WITH_GITHUB = gql`
  mutation appEnableSyncWithGithubRepo(
    $githubRepo: String!
    $githubBranch: String
    $appId: String!
  ) {
    appEnableSyncWithGithubRepo(
      data: { githubRepo: $githubRepo, githubBranch: $githubBranch }
      where: { id: $appId }
    ) {
      id
      githubSyncEnabled
      githubRepo
      githubBranch
    }
  }
`;
