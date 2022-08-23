import { Icon, Snackbar } from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { match } from "react-router-dom";
import PageContent from "../../Layout/PageContent";
import {
  EnumGitOrganizationType,
  EnumResourceType,
  Resource,
} from "../../models";
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
type Props = {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};
const SyncWithGithubPage: React.FC<Props> = ({ match }) => {
  const resourceId = match.params.resource;

  const { data, error, refetch } = useQuery<{
    resource: Resource;
  }>(GET_RESOURCE_GIT_REPOSITORY, {
    variables: {
      resourceId: resourceId,
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
          If you connect to GitHub, every time you commit your changes, it
          automatically pushes your generated code and creates a Pull Request in
          your GitHub repository.
        </div>
        {data?.resource && !isServiceResource && (
          <AuthResourceWithGit resource={data.resource} onDone={refetch} />
        )}
        {isServiceResource && data?.resource && (
          <ServiceConfigurationGitSettings
            resource={data.resource}
            onDone={refetch}
          />
        )}
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    </PageContent>
  );
};

export default SyncWithGithubPage;

export const GET_RESOURCE_GIT_REPOSITORY = gql`
  query getResourceGitRepository($resourceId: String!) {
    resource(where: { id: $resourceId }) {
      id
      name
      color
      githubLastSync
      resourceType
      gitRepositoryOverride
      createdAt
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
