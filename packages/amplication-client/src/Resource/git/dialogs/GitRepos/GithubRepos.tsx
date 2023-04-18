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
import { useCallback, useState } from "react";
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
import { GitSelectMenu } from "../../select/GitSelectMenu";

const CLASS_NAME = "git-repos";
const MAX_ITEMS_PER_PAGE = 10; // aligned with server for both github and bitbucket

type Props = {
  gitOrganizationId: string;
  onGitRepositoryConnected: (data: GitRepositorySelected) => void;
  gitProvider: EnumGitProvider;
};

export type GitRepositorySelected = {
  gitOrganizationId: string;
  repositoryName: string;
  gitRepositoryUrl?: string;
};

export type GitRepositoryCreatedData = {
  name: string;
  gitOrganizationId: string;
  gitOrganizationType: EnumGitOrganizationType;
  gitProvider: EnumGitProvider;
  public: boolean;
  gitRepositoryUrl?: string;
};

function GitRepos({
  gitOrganizationId,
  onGitRepositoryConnected,
  gitProvider,
}: Props) {
  const [page, setPage] = useState(1);

  const { data: gitGroups } = useQuery(GET_GROUPS, {
    variables: {
      organizationId: gitOrganizationId,
    },
  });

  const [repositoryGroup, setRepositoryGroup] = useState(gitGroups?.[0]);

  const {
    data,
    error,
    loading: loadingRepos,
    refetch,
    networkStatus,
  } = useQuery<{ remoteGitRepositories: RemoteGitRepos }>(FIND_GIT_REPOS, {
    variables: {
      repositoryGroupName: repositoryGroup?.name,
      gitOrganizationId,
      gitProvider,
      limit: MAX_ITEMS_PER_PAGE,
      page: page,
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleRepoSelected = useCallback(
    (data: RemoteGitRepository) => {
      onGitRepositoryConnected({
        gitOrganizationId: gitOrganizationId,
        repositoryName: data.name,
        gitRepositoryUrl: `https://github.com/${data.name}`,
      });
    },
    [gitOrganizationId, onGitRepositoryConnected]
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
          <h4>Select {gitProvider} repository</h4>
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
      <GitSelectMenu
        selectedItem={repositoryGroup}
        items={gitGroups}
        onSelect={setRepositoryGroup}
      />
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
    $repositoryGroupName: String
    $gitOrganizationId: String!
    $gitProvider: EnumGitProvider!
    $limit: Float!
    $page: Float!
  ) {
    remoteGitRepositories(
      where: {
        repositoryGroupName: $repositoryGroupName
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

const GET_GROUPS = gql`
  query gitGroups($organizationId: String!) {
    gitGroups(where: { organizationId: $organizationId }) {
      total
      page
      pageSize
      groups {
        id
        name
        slug
      }
    }
  }
`;
