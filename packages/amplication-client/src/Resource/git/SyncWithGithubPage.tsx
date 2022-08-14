import { Icon, Snackbar } from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { match } from "react-router-dom";
import PageContent from "../../Layout/PageContent";
import { EnumGitOrganizationType, EnumResourceType } from "../../models";
import { formatError } from "../../util/error";
import AuthResourceWithGit from "./AuthResourceWithGit";
import ServiceConfigurationGitSettings from "./ServiceConfigurationGitSettings";
import "./SyncWithGithubPage.scss";

const CLASS_NAME = "sync-with-github-page";

export type GitOrganizationFromGitRepository = {
  id: string;
  name: string;
  type: EnumGitOrganizationType;
};
export type WorkspaceFromResourceWithGitOrganizations = {
  id: string;
  name: string;
  gitOrganizations: {
    id: string;
    name: string;
    type: EnumGitOrganizationType;
  }[];
};
export type GitRepositoryWithGitOrganization = {
  id: string;
  name: string;
  gitOrganization: GitOrganizationFromGitRepository;
};
export type ResourceWithGitRepository = {
  id: string;
  resourceType: EnumResourceType;
  gitRepository: null | GitRepositoryWithGitOrganization;
};

type Props = {
  match: match<{ resource: string }>;
};
function SyncWithGithubPage({ match }: Props) {
  const { resource } = match.params;

  const { data, error, refetch } = useQuery<{
    resource: ResourceWithGitRepository;
  }>(GET_RESOURCE_GIT_REPOSITORY, {
    variables: {
      resourceId: resource,
    },
  });

  const pageTitle = "GitHub";
  const errorMessage = formatError(error);
  const isServiceResource =
    data?.resource.resourceType === EnumResourceType.Service;

  return (
    <PageContent pageTitle={pageTitle}>
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__header`}>
          <Icon icon="github" size="xlarge" />
          <h1>Sync with GitHub</h1>
        </div>
        <div className={`${CLASS_NAME}__message`}>
          Enable sync with GitHub to automatically push the generated code of
          your resource and create a Pull Request in your GitHub repository
          every time you commit your changes.
        </div>
        {data?.resource && !isServiceResource && (
          <AuthResourceWithGit resource={data.resource} onDone={refetch} />
        )}
        {isServiceResource && (
          <ServiceConfigurationGitSettings resource={data.resource} onDone={refetch}/>
        )}
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    </PageContent>
  );
}

export default SyncWithGithubPage;

export const GET_RESOURCE_GIT_REPOSITORY = gql`
  query getResourceGitRepository($resourceId: String!) {
    resource(where: { id: $resourceId }) {
      id
      name
      color
      githubLastSync
      resourceType
      gitRepository {
        id
        name
        gitOrganization {
          id
          name
          type
        }
      }
    }
  }
`;
