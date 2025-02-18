import { HorizontalRule, Snackbar } from "@amplication/ui/design-system";
import { gql, useQuery } from "@apollo/client";
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
import ResourceGitSettings from "./ResourceGitSettings";
import ResourceGitSettingsWithOverride from "./ResourceGitSettingsWithOverride";

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

const ResourceGitSettingsPage: React.FC = () => {
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

  const handleRepositorySelected = useCallback(() => {
    refreshCurrentWorkspace();
    refetch();
  }, [refreshCurrentWorkspace, refetch]);

  const pageTitle = "Sync with Git Provider";
  const errorMessage = formatError(error);
  const isProjectConfiguration =
    data?.resource.resourceType === EnumResourceType.ProjectConfiguration;

  return (
    <PageContent
      pageTitle={pageTitle}
      contentTitle={TITLE}
      contentSubTitle={SUB_TITLE}
    >
      <HorizontalRule />
      {data?.resource && isProjectConfiguration && (
        <ResourceGitSettings
          type="resource"
          resource={data.resource}
          gitRepositorySelectedCb={handleRepositorySelected}
          gitRepositoryCreatedCb={handleRepositorySelected}
        />
      )}
      {!isProjectConfiguration && data?.resource && (
        <ResourceGitSettingsWithOverride
          resource={data.resource}
          gitRepositorySelectedCb={handleRepositorySelected}
          gitRepositoryCreatedCb={handleRepositorySelected}
        />
      )}

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </PageContent>
  );
};

export default ResourceGitSettingsPage;

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
