import React, { useCallback } from "react";
import { Snackbar } from "@rmwc/snackbar";
import { gql, useQuery, useMutation } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import { CircularProgress } from "@rmwc/circular-progress";
import GithubRepoItem from "./GithubRepoItem";
import "./GithubRepos.scss";

const CLASS_NAME = "github-repos";

type Props = {
  applicationId: string;
  onCompleted: () => void;
};

function GithubRepos({ applicationId, onCompleted }: Props) {
  const { data, error, loading } = useQuery<{
    appAvailableGithubRepos: models.GithubRepo[];
  }>(FIND_GITHUB_REPOS, {
    variables: {
      id: applicationId,
    },
  });

  const [enableSyncWithGithub, { error: errorUpdate }] = useMutation<
    models.App
  >(ENABLE_SYNC_WITH_GITHUB, {
    onCompleted: () => {
      onCompleted();
    },
  });

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
      <h3>Select a GitHub repository to sync your application with.</h3>
      {loading && <CircularProgress />}
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
