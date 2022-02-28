import {
  CircularProgress,
  Snackbar,
  Tooltip,
} from "@amplication/design-system";
import { gql, NetworkStatus, useMutation } from "@apollo/client";
import React, { useCallback } from "react";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import { EnumGitProvider, GitRepo } from "../../../../models";
import { useTracking } from "../../../../util/analytics";
import { formatError } from "../../../../util/error";
import useGetReposOfUser from "../../hooks/useGetReposOfUser";
import GitRepoItem from "./GitRepoItem/GitRepoItem";
import "./GitRepos.scss";

const CLASS_NAME = "git-repos";

type Props = {
  gitOrganizationId: string;
  applicationId: string;
  onGitRepositoryConnected: () => void;
  gitProvider: EnumGitProvider;
};

function GitRepos({
  applicationId,
  gitOrganizationId,
  onGitRepositoryConnected,
  gitProvider,
}: Props) {
  const { trackEvent } = useTracking();

  const {
    refetch,
    error,
    repos,
    loading: loadingRepos,
    networkStatus,
  } = useGetReposOfUser({
    gitOrganizationId: gitOrganizationId,
    gitProvider,
  });
  const [connectGitRepository, { error: errorUpdate }] = useMutation(
    CONNECT_GIT_REPOSITORY
  );
  const handleRepoSelected = useCallback(
    (data: GitRepo) => {
      connectGitRepository({
        variables: {
          gitOrganizationId,
          appId: applicationId,
          name: data.name,
        },
      }).catch(console.error);
      trackEvent({
        eventName: "selectGitRepo",
      });
      onGitRepositoryConnected();
    },
    [
      applicationId,
      connectGitRepository,
      gitOrganizationId,
      onGitRepositoryConnected,
      trackEvent,
    ]
  );
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const errorMessage = formatError(error || errorUpdate);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <h4>
          Select a {gitProvider} repository to sync your application with.
        </h4>
        {loadingRepos || networkStatus === NetworkStatus.refetch ? (
          <CircularProgress />
        ) : (
          <Tooltip aria-label="Refresh repositories" direction="w" noDelay wrap>
            <Button
              buttonStyle={EnumButtonStyle.Clear}
              onClick={(e) => {
                handleRefresh();
              }}
              type="button"
              icon="refresh_cw"
            />
          </Tooltip>
        )}
      </div>
      {networkStatus !== NetworkStatus.refetch && // hide data if refetch
        repos?.map((repo) => (
          <GitRepoItem
            key={repo.fullName}
            repo={repo}
            onSelectRepo={handleRepoSelected}
          />
        ))}
      <Snackbar open={Boolean(error || errorUpdate)} message={errorMessage} />
    </div>
  );
}

export default GitRepos;

const CONNECT_GIT_REPOSITORY = gql`
  mutation connectGitRepository(
    $name: String!
    $gitOrganizationId: String!
    $appId: String!
  ) {
    connectGitRepository(
      data: {
        name: $name
        appId: $appId
        gitOrganizationId: $gitOrganizationId
      }
    ) {
      id
    }
  }
`;
