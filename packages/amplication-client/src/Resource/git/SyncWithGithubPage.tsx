import { HorizontalRule, Snackbar } from "@amplication/ui/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useContext } from "react";
import PageContent from "../../Layout/PageContent";
import { AppContext } from "../../context/appContext";
import {
  EnumGitOrganizationType,
  EnumGitProvider,
  EnumResourceType,
  Resource,
} from "../../models";
import { formatError } from "../../util/error";
import AuthWithGitProvider from "./AuthWithGitProvider";
import ServiceConfigurationGitSettings from "./ServiceConfigurationGitSettings";
import { GitRepositorySelected } from "./dialogs/GitRepos/GithubRepos";
import { CONNECT_GIT_REPOSITORY } from "./queries/gitProvider";

const TITLE = "Sync with Git Provider";
const SUB_TITLE =
  "Enable sync with Git provider to automatically push the generated code of your application and create a Pull Request in your Git provider repository every time you commit your changes.";

export type GitOrganizationFromGitRepository = {
  id: string;
  name: string;
  type: EnumGitOrganizationType;
  provider: EnumGitProvider;
  useGroupingForRepositories: boolean;
};

const SyncWithGithubPage: React.FC = () => {
  const {
    currentProjectConfiguration,
    currentResource,
    refreshCurrentWorkspace,
  } = useContext(AppContext);

  const resourceId = currentResource
    ? currentResource.id
    : currentProjectConfiguration?.id;

  const { data, error, refetch } = useQuery<{
    resource: Resource;
  }>(GET_RESOURCE_GIT_REPOSITORY, {
    variables: {
      resourceId: resourceId,
    },
    skip: !resourceId,
  });

  const [connectGitRepository] = useMutation(CONNECT_GIT_REPOSITORY);

  const handleOnDone = useCallback(() => {
    refreshCurrentWorkspace();
    refetch();
  }, [refreshCurrentWorkspace, refetch]);

  const pageTitle = "Sync with Git Provider";
  const errorMessage = formatError(error);
  const isProjectConfiguration =
    data?.resource.resourceType === EnumResourceType.ProjectConfiguration;
  const gitRepositorySelectedCb = useCallback(
    (gitRepository: GitRepositorySelected) => {
      connectGitRepository({
        variables: {
          name: gitRepository.repositoryName,
          gitOrganizationId: gitRepository.gitOrganizationId,
          resourceId: data?.resource.id,
          groupName: gitRepository.groupName,
        },
      }).catch(console.error);
    },
    [connectGitRepository, data?.resource]
  );

  return (
    <PageContent
      pageTitle={pageTitle}
      contentTitle={TITLE}
      contentSubTitle={SUB_TITLE}
    >
      <HorizontalRule />
      {data?.resource && isProjectConfiguration && (
        <AuthWithGitProvider
          type="resource"
          resource={data.resource}
          onDone={handleOnDone}
          gitRepositorySelectedCb={gitRepositorySelectedCb}
          gitRepositoryCreatedCb={handleOnDone}
        />
      )}
      {!isProjectConfiguration && data?.resource && (
        <ServiceConfigurationGitSettings
          resource={data.resource}
          onDone={handleOnDone}
          gitRepositorySelectedCb={gitRepositorySelectedCb}
          gitRepositoryCreatedCb={handleOnDone}
        />
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </PageContent>
  );
};

export default SyncWithGithubPage;

export const GET_RESOURCE_GIT_REPOSITORY = gql`
  query getResourceGitRepository($resourceId: String!) {
    resource(where: { id: $resourceId }) {
      id
      name
      githubLastSync
      resourceType
      gitRepositoryOverride
      createdAt
      gitRepository {
        id
        name
        groupName
        baseBranchName
        gitOrganization {
          id
          name
          type
          provider
          useGroupingForRepositories
        }
      }
    }
  }
`;
