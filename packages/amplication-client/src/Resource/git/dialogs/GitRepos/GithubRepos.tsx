import {
  CircularProgress,
  Snackbar,
  Tooltip,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Pagination
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

type Props = {
  gitOrganizationId: string;
  resourceId: string;
  onGitRepositoryConnected: () => void;
  gitProvider: EnumGitProvider;
};

interface limit {
  id: string,
  value: number,
}
const limits = [{
  id: "repos-limit-1",
  value: 10,
}, {
  id: "repos-limit-2",
  value: 20,
}, {
  id: "repos-limit-1",
  value: 30,
}]

function GitRepos({
  resourceId,
  gitOrganizationId,
  onGitRepositoryConnected,
  gitProvider,
}: Props) {
  const { trackEvent } = useTracking();
  const [limit, setLimit] = useState<limit>(limits[0])
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
      limit: limit.value,
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
      {!loadingRepos && <div className={`${CLASS_NAME}__pagination`}>
        <SelectMenu title={limit.value.toString()} buttonStyle={EnumButtonStyle.Secondary} icon="chevron_down">
          <SelectMenuModal>
            <SelectMenuList>
              {limits.map((item, index) => {
                return (
                  <SelectMenuItem
                    closeAfterSelectionChange
                    selected={item.value === limit.value}
                    onSelectionChange={() => {
                      setLimit(limits[index])
                      setPage(1)
                    }} key={item.id}
                  >
                    {item.value}
                  </SelectMenuItem>
                )
              })}

            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
        {data && <Pagination pageCount={Math.ceil(data?.remoteGitRepositories?.totalRepos / data?.remoteGitRepositories?.pageSize)} currentPage={page} onPageChange={(e, page) => {
          console.log(page)
          setPage(page)
        }}
          sx={{ marginTop: 0, marginBottom: 0 }}
        />}
      </div>}
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
