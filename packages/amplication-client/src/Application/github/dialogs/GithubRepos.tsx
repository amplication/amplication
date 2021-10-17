import { gql, NetworkStatus, useMutation, useQuery } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import { Snackbar } from "@rmwc/snackbar";
import React, { useCallback } from "react";
import { Button, EnumButtonStyle } from "../../../Components/Button";
import * as models from "../../../models";
import GithubRepoItem from "../../../Settings/GithubRepoItem";
import { formatError } from "../../../util/error";
import "./GithubRepos.scss";

const CLASS_NAME = "github-repos";

type Props = {
  applicationId: string;
  onCompleted: () => void;
};

function GithubRepos({ applicationId, onCompleted }: Props) {
  // const {} = useGithubSelection();
  const { data, error, loading, refetch, networkStatus } = useQuery<{
    getReposOfUser: models.GitRepo[];
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
    (data: models.GitRepo) => {
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
      {data?.getReposOfUser.map((repo) => (
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
  query getReposOfUser($id: String!) {
    getReposOfUser(appId: $id, sourceControlService: Github) {
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
