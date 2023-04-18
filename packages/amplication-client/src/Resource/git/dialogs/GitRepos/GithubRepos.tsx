import {
  CircularProgress,
  Snackbar,
  Tooltip,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  HorizontalRule,
  EnumHorizontalRuleStyle,
} from "@amplication/ui/design-system";
import { gql, NetworkStatus, useQuery } from "@apollo/client";
import React, { useCallback, useContext, useState } from "react";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import {
  EnumGitProvider,
  RemoteGitRepository,
  RemoteGitRepos,
  EnumGitOrganizationType,
} from "../../../../models";
import { formatError } from "../../../../util/error";
import GitRepoItem from "./GitRepoItem/GitRepoItem";
import "./GitRepos.scss";
import { GitOrganizationFromGitRepository } from "../../SyncWithGithubPage";
import { AppContext } from "../../../../context/appContext";

const CLASS_NAME = "git-repos";
const MAX_ITEMS_PER_PAGE = 10;

type Props = {
  gitOrganization: GitOrganizationFromGitRepository;
  onGitRepositoryConnected: (data: GitRepositorySelected) => void;
};

export type GitRepositorySelected = {
  gitOrganizationId: string;
  repositoryName: string;
  gitRepositoryUrl?: string;
  gitProvider: EnumGitProvider;
};

export type GitRepositoryCreatedData = {
  name: string;
  gitOrganizationId: string;
  gitOrganizationType: EnumGitOrganizationType;
  gitProvider: EnumGitProvider;
  public: boolean;
  gitRepositoryUrl?: string;
};

function GitRepos({ gitOrganization, onGitRepositoryConnected }: Props) {
  const { gitRepositoryUrl } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const {
    data,
    error,
    loading: loadingRepos,
    refetch,
    networkStatus,
  } = useQuery<{ remoteGitRepositories: RemoteGitRepos }>(FIND_GIT_REPOS, {
    variables: {
      gitOrganizationId: gitOrganization.id,
      gitProvider: gitOrganization.provider,
      limit: MAX_ITEMS_PER_PAGE,
      page: page,
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleRepoSelected = useCallback(
    (data: RemoteGitRepository) => {
      onGitRepositoryConnected({
        gitOrganizationId: gitOrganization.id,
        repositoryName: data.name,
        gitRepositoryUrl: gitRepositoryUrl,
        gitProvider: gitOrganization.provider,
      });
    },
    [gitOrganization.id, onGitRepositoryConnected]
  );
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <HorizontalRule style={EnumHorizontalRuleStyle.Black10} />
      <div className={`${CLASS_NAME}__header`}>
        <div className={`${CLASS_NAME}__header-left`}>
          <h4>Select {gitOrganization.provider} repository</h4>
          {loadingRepos || networkStatus === NetworkStatus.refetch ? (
            <CircularProgress />
          ) : (
            <Tooltip
              aria-label="Refresh repositories"
              direction="w"
              noDelay
              wrap
            >
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
          <SelectMenu
            title={page.toString()}
            buttonStyle={EnumButtonStyle.Secondary}
            icon="chevron_down"
          >
            <SelectMenuModal>
              <SelectMenuList>
                {Array.from(
                  {
                    length: Math.ceil(
                      data?.remoteGitRepositories.total /
                        data?.remoteGitRepositories.pageSize
                    ),
                  },
                  (_, index) => index + 1
                ).map((item, i) => {
                  return (
                    <SelectMenuItem
                      closeAfterSelectionChange
                      selected={item === page}
                      onSelectionChange={() => {
                        setPage(item);
                      }}
                      key={i}
                    >
                      {item}
                    </SelectMenuItem>
                  );
                })}
              </SelectMenuList>
            </SelectMenuModal>
          </SelectMenu>
        </div>
      </div>
      {networkStatus !== NetworkStatus.refetch && // hide data if refetch
        data?.remoteGitRepositories?.repos?.map((repo) => (
          <GitRepoItem
            key={repo?.fullName}
            repo={repo}
            onSelectRepo={handleRepoSelected}
          />
        ))}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
}

export default GitRepos;

export const CONNECT_GIT_REPOSITORY = gql`
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
      total
      currentPage
      pageSize
    }
  }
`;
