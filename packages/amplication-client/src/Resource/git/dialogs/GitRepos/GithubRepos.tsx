import {
  CircularProgress,
  Snackbar,
  Tooltip,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  HorizontalRule,
  EnumHorizontalRuleStyle
} from "@amplication/design-system";
import { gql, NetworkStatus, useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useState } from "react";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import { EnumGitProvider, RemoteGitRepository, RemoteGitRepos } from "../../../../models";
import { useTracking } from "../../../../util/analytics";
import { formatError } from "../../../../util/error";
import GitRepoItem from "./GitRepoItem/GitRepoItem";
import "./GitRepos.scss";

const CLASS_NAME = "git-repos";
const MAX_ITEMS_PER_PAGE = 50;

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
  const [page, setPage] = useState(1)
  const {
    data,
    error,
    loading: loadingRepos,
    refetch,
    networkStatus,
  } = useQuery<{ remoteGitRepositories: RemoteGitRepos }>(FIND_GIT_REPOS, {
    variables: {
      gitOrganizationId,
      gitProvider,
      limit: MAX_ITEMS_PER_PAGE,
      page: page
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
      <HorizontalRule style={EnumHorizontalRuleStyle.Black10} />
      <div className={`${CLASS_NAME}__header`}>
        <div className={`${CLASS_NAME}__header-left`}>
          <h4>Select {gitProvider} repository</h4>
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
        <div className={`${CLASS_NAME}__header-right`}>
          <h4>Page</h4>
          <SelectMenu title={page.toString()} buttonStyle={EnumButtonStyle.Secondary} icon="chevron_down">
            <SelectMenuModal>
              <SelectMenuList>
                {Array.from({length: Math.ceil(data?.remoteGitRepositories.totalRepos / data?.remoteGitRepositories.pageSize)}, (_, index) => index + 1).map((item, i) => {
                  return (
                    <SelectMenuItem
                      closeAfterSelectionChange
                      selected={item === page}
                      onSelectionChange={() => {
                        setPage(item)
                      }} key={i}
                    >
                      {item}
                    </SelectMenuItem>
                  )
                })}
              </SelectMenuList>
            </SelectMenuModal>
          </SelectMenu>
        </div>
      </div>
      {
        networkStatus !== NetworkStatus.refetch && // hide data if refetch
        data?.remoteGitRepositories?.repos?.map((repo) => (
          <GitRepoItem
            key={repo?.fullName}
            repo={repo}
            onSelectRepo={handleRepoSelected}
          />
        ))
      }
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
    $limit: Float!
    $page: Float!
  ) {
    remoteGitRepositories(
      where: {
        gitOrganizationId: $gitOrganizationId
        gitProvider: $gitProvider
        limit: $limit
        page: $page
      }
    ) {
      repos {
        name
        url
        private
        fullName
        admin
      }
      totalRepos
      currentPage
      pageSize
    }
  }
`;
