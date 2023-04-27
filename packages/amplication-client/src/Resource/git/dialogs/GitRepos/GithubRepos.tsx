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
  Label,
} from "@amplication/ui/design-system";
import { gql, NetworkStatus, useLazyQuery, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
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
  useGroupingForRepositories?: boolean;
  openCreateNewRepo: () => void;
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
  useGroupingForRepositories,
  openCreateNewRepo,
}: Props) {
  const [page, setPage] = useState(1);

  const { data: gitGroupsData } = useQuery(GET_GROUPS, {
    variables: {
      organizationId: gitOrganizationId,
    },
  });

  const gitGroups = gitGroupsData?.gitGroups?.groups;
  const [repositoryGroup, setRepositoryGroup] = useState(null);
  const [numberOfPages, setNumberOfPages] = useState(null);

  useEffect(() => {
    if (!repositoryGroup && gitGroups && gitGroups.length > 0) {
      setRepositoryGroup(gitGroups[0]);
    }
  }, [gitGroups]);

  const [
    getRepos,
    { data, error, loading: loadingRepos, refetch, networkStatus },
  ] = useLazyQuery<{ remoteGitRepositories: RemoteGitRepos }>(FIND_GIT_REPOS, {
    variables: {
      repositoryGroupName: repositoryGroup?.name,
      gitOrganizationId,
      gitProvider,
      limit: MAX_ITEMS_PER_PAGE,
      page: page,
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (useGroupingForRepositories) {
      if (repositoryGroup) {
        getRepos({
          variables: {
            repositoryGroupName: repositoryGroup.name,
            gitOrganizationId,
            gitProvider,
            limit: MAX_ITEMS_PER_PAGE,
            page: page,
          },
        });
      }
    } else {
      getRepos({
        variables: {
          gitOrganizationId,
          gitProvider,
          limit: MAX_ITEMS_PER_PAGE,
          page: page,
        },
      });
    }
  }, [useGroupingForRepositories, repositoryGroup]);

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

  useEffect(() => {
    if (!data) return;

    const pages = Math.ceil(
      data?.remoteGitRepositories.total / data?.remoteGitRepositories.pageSize
    );
    if (pages && pages > 1) setNumberOfPages(pages);
  }, [data]);

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      {useGroupingForRepositories && (
        <>
          <HorizontalRule style={EnumHorizontalRuleStyle.Black10} />
          <Label
            className={`${CLASS_NAME}__change-label`}
            text="Change workspace"
          />
          <GitSelectMenu
            gitProvider={gitProvider}
            selectedItem={repositoryGroup}
            items={gitGroups}
            onSelect={setRepositoryGroup}
          />
        </>
      )}
      <HorizontalRule style={EnumHorizontalRuleStyle.Black10} />
      <div className={`${CLASS_NAME}__header`}>
        <div className={`${CLASS_NAME}__header-left`}>
          {loadingRepos || networkStatus === NetworkStatus.refetch ? (
            <CircularProgress />
          ) : (
            <>
              {numberOfPages && (
                <SelectMenu
                  title={page.toString()}
                  buttonStyle={EnumButtonStyle.Secondary}
                  icon="chevron_down"
                >
                  <SelectMenuModal className={`${CLASS_NAME}__menu`}>
                    <SelectMenuList className={`${CLASS_NAME}__list`}>
                      {Array.from(
                        { length: numberOfPages },
                        (_, index) => index + 1
                      ).map((item, i) => {
                        return (
                          <SelectMenuItem
                            className={`${CLASS_NAME}__item`}
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
              )}
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
            </>
          )}
        </div>
        <div className={`${CLASS_NAME}__header-right`}>
          <Button
            className={`${CLASS_NAME}__header-create`}
            buttonStyle={EnumButtonStyle.Outline}
            onClick={(e) => {
              openCreateNewRepo();
            }}
            type="button"
          >
            Create repository
          </Button>
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
