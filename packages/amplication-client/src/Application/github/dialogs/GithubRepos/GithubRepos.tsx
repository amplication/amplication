import { gql, NetworkStatus, useQuery } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import { Snackbar } from "@rmwc/snackbar";
import React, { useCallback } from "react";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import * as models from "../../../../models";
import { formatError } from "../../../../util/error";
import GithubRepoItem from "./GithubRepoItem/GithubRepoItem";
import "./GithubRepos.scss";

const CLASS_NAME = "github-repos";

type Props = {
  applicationId: string;
  onCompleted: () => void;
};

function GithubRepos({ applicationId, onCompleted }: Props) {
  const { data, error, loading, refetch, networkStatus } = useQuery<{
    getReposOfUser: models.GitRepo[];
  }>(FIND_GITHUB_REPOS, {
    variables: {
      id: applicationId,
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);
  const errorMessage = formatError(error);

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
        <GithubRepoItem key={repo.fullName} appId={applicationId} repo={repo} />
      ))}
      <Snackbar open={Boolean(error)} message={errorMessage} />
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
