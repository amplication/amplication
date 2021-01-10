import React, { useCallback } from "react";
import { Snackbar } from "@rmwc/snackbar";
import { gql, useQuery, useMutation } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import { CircularProgress } from "@rmwc/circular-progress";
import { Button } from "@amplication/design-system";

const CLASS_NAME = "github-repos";

type Props = {
  applicationId: string;
};

function GithubRepos({ applicationId }: Props) {
  const { data, error, loading } = useQuery<{
    appAvailableGithubRepos: models.GithubRepo[];
  }>(FIND_GITHUB_REPOS, {
    variables: {
      id: applicationId,
    },
  });

  const [enableSyncWithGithub, { error: errorUpdate }] = useMutation<
    models.App
  >(ENABLE_SYNC_WITH_GITHUB);

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
      Select Repo
      {loading && <CircularProgress />}
      {data?.appAvailableGithubRepos.map((repo) => (
        <div key={repo.fullName}>
          <div>full name: {repo.fullName}</div>
          <div>admin: {repo.admin}</div>
          <div>name: {repo.name}</div>
          <div>private: {repo.private}</div>
          <div>url: {repo.url}</div>
          {/**@todo: use child component to properly use callback  */}
          <Button
            onClick={() => {
              handleRepoSelected(repo);
            }}
          >
            Select
          </Button>
          <br />
          <br />
          <br />
        </div>
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
