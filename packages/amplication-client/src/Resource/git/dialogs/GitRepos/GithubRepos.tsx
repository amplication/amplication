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

import { NetworkStatus, useQuery, useLazyQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
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
import { GitOrganizationFromGitRepository } from "../../SyncWithGithubPage";
import { FIND_GIT_REPOS, GET_GROUPS } from "../../queries/gitProvider";

const CLASS_NAME = "git-repos";
const MAX_ITEMS_PER_PAGE = 10;

type Props = {
  gitOrganization: GitOrganizationFromGitRepository;
  onGitRepositoryConnected: (data: GitRepositorySelected) => void;
  gitProvider: EnumGitProvider;
  openCreateNewRepo: () => void;
};

export type GitRepositorySelected = {
  gitOrganizationId: string;
  repositoryName: string;
  gitRepositoryUrl?: string;
  gitProvider: EnumGitProvider;
  groupName?: string;
};

export type GitRepositoryCreatedData = {
  name: string;
  gitOrganizationId: string;
  gitOrganizationType: EnumGitOrganizationType;
  gitProvider: EnumGitProvider;
  isPublic: boolean;
  groupName?: string;
  gitRepositoryUrl?: string;
  resourceId?: string;
};

function GitRepos({
  gitOrganization,
  onGitRepositoryConnected,
  gitProvider,
  openCreateNewRepo,
}: Props) {
  const [page, setPage] = useState(1);

  const { data: gitGroupsData } = useQuery(GET_GROUPS, {
    variables: {
      organizationId: gitOrganization.id,
    },
    skip: !gitOrganization.useGroupingForRepositories,
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
      groupName: repositoryGroup?.name,
      gitOrganizationId: gitOrganization.id,
      gitProvider: gitOrganization.provider,
      perPage: MAX_ITEMS_PER_PAGE,
      page: page,
    },
    notifyOnNetworkStatusChange: true,
  });

  const getReposFunc = useCallback(() => {
    if (gitOrganization.useGroupingForRepositories) {
      repositoryGroup &&
        getRepos({
          variables: {
            groupName: repositoryGroup.name,
            gitOrganizationId: gitOrganization.id,
            gitProvider: gitOrganization.provider,
            limit: MAX_ITEMS_PER_PAGE,
            page: page,
          },
        });
    } else {
      getRepos({
        variables: {
          gitOrganizationId: gitOrganization.id,
          gitProvider: gitOrganization.provider,
          limit: MAX_ITEMS_PER_PAGE,
          page: page,
        },
      });
    }
  }, [getRepos, repositoryGroup, page]);

  useEffect(() => {
    getReposFunc();
  }, [getReposFunc]);

  const handleRepoSelected = useCallback(
    (data: RemoteGitRepository) => {
      onGitRepositoryConnected({
        gitOrganizationId: gitOrganization.id,
        repositoryName: data.name,
        gitRepositoryUrl: data.url,
        gitProvider: gitOrganization.provider,
        groupName: data.groupName,
      });
    },
    [gitOrganization.id, onGitRepositoryConnected]
  );
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!data) return;

    const pages = Math.ceil(
      data?.remoteGitRepositories.total /
        data?.remoteGitRepositories.pagination.perPage
    );
    if (pages && pages > 1) setNumberOfPages(pages);
  }, [data]);

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      {gitOrganization.useGroupingForRepositories && (
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
                              getReposFunc();
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
          {gitOrganization.type === EnumGitOrganizationType.Organization && (
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
          )}
          {gitOrganization.type === EnumGitOrganizationType.User &&
            gitOrganization.provider === EnumGitProvider.Github && (
              <a
                href={`https://github.com/new?&owner=${gitOrganization.name}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  className={`${CLASS_NAME}__header-create`}
                  buttonStyle={EnumButtonStyle.Outline}
                  type="button"
                >
                  Create repository
                </Button>
              </a>
            )}
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
