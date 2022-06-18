import {
  CircularProgress,
  Snackbar,
  Tooltip,
} from "@amplication/design-system";
import { gql, NetworkStatus, useMutation, useQuery } from "@apollo/client";
import React, { useCallback } from "react";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import { EnumGitProvider, RemoteGitRepository } from "../../../../models";
import { useTracking } from "../../../../util/analytics";
import { formatError } from "../../../../util/error";
import GitRepoItem from "./GitRepoItem/GitRepoItem";
import "./GitRepos.scss";

const CLASS_NAME = "git-repos";

type Props = {
  gitOrganizationId: string;
  resourceId: string;
  onGitRepositoryConnected: () => void;
  gitProvider: EnumGitProvider;
};

function GitRepos({
  resourceId,
  gitOrganizationId,
  onGitRepositoryConnected,
  gitProvider,
}: Props) {
  const { trackEvent } = useTracking();

  const {
    data,
    error,
    loading: loadingRepos,
    refetch,
    networkStatus,
  } = useQuery<{
    remoteGitRepositories: RemoteGitRepository[];
  }>(FIND_GIT_REPOS, {
    variables: {
      gitOrganizationId,
      gitProvider,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [connectGitRepository, { error: errorUpdate }] = useMutation(
    CONNECT_GIT_REPOSITORY
  );
  const handleRepoSelected = useCallback(
    (data: RemoteGitRepository) => {
      connectGitRepository({
        variables: {
          gitOrganizationId,
          resourceId,
          name: data.name,
        },
      }).catch(console.error);
      trackEvent({
        eventName: "selectGitRepo",
      });
      onGitRepositoryConnected();
    },
    [
      resourceId,
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
        <h4>Select a {gitProvider} repository to sync your resource with.</h4>
        {loadingRepos || networkStatus === NetworkStatus.refetch ? (
          <CircularProgress />
        ) : (
          <Tooltip aria-label="Refresh repositories" direction="w" noDelay wrap>
            <Button
              buttonStyle={EnumButtonStyle.Text}
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
        data?.remoteGitRepositories?.map((repo) => (
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
  mutation connectResourceGitRepository(
    $name: String!
    $gitOrganizationId: String!
    $resourceId: String!
  ) {
    connectResourceGitRepository(
      data: {
        name: $name
        resourceId: $resourceId
        gitOrganizationId: $gitOrganizationId
      }
    ) {
      id
      gitRepository {
        id
      }
    }
  }
`;

const FIND_GIT_REPOS = gql`
  query remoteGitRepositories(
    $gitOrganizationId: String!
    $gitProvider: EnumGitProvider!
  ) {
    remoteGitRepositories(
      where: {
        gitOrganizationId: $gitOrganizationId
        gitProvider: $gitProvider
      }
    ) {
      name
      url
      private
      fullName
      admin
    }
  }
`;
