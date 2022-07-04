import { Icon, Snackbar } from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { match } from "react-router-dom";
import PageContent from "../../Layout/PageContent";
import useNavigationTabs from "../../Layout/UseNavigationTabs";
import { EnumGitOrganizationType } from "../../models";
import { formatError } from "../../util/error";
import AuthAppWithGit from "./AuthAppWithGit";
import "./SyncWithGithubPage.scss";

const CLASS_NAME = "sync-with-github-page";

export type GitOrganizationFromGitRepository = {
  id: string;
  name: string;
  type: EnumGitOrganizationType;
};
export type WorkspaceFromAppWithGitOrganizations = {
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
export type AppWithGitRepository = {
  id: string;
  workspace: WorkspaceFromAppWithGitOrganizations;
  gitRepository: null | GitRepositoryWithGitOrganization;
};

type Props = {
  match: match<{ application: string }>;
};
const NAVIGATION_KEY = "GITHUB";
function SyncWithGithubPage({ match }: Props) {
  const { application } = match.params;

  const { data, error, refetch } = useQuery<{ app: AppWithGitRepository }>(
    GET_APP_GIT_REPOSITORY,
    {
      variables: {
        appId: application,
      },
    }
  );
  const pageTitle="GitHub";
  useNavigationTabs(application, NAVIGATION_KEY, match.url, pageTitle);
  const errorMessage = formatError(error);

  return (
    <PageContent pageTitle={pageTitle}>
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__header`}>
          <Icon icon="github" size="xlarge" />
          <h1>Sync with GitHub</h1>
        </div>
        <div className={`${CLASS_NAME}__message`}>
          Enable sync with GitHub to automatically push the generated code of
          your application and create a Pull Request in your GitHub repository
          every time you commit your changes.
        </div>
        {data?.app && <AuthAppWithGit app={data.app} onDone={refetch} />}

        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    </PageContent>
  );
}

export default SyncWithGithubPage;

export const GET_APP_GIT_REPOSITORY = gql`
  query getAppGitRepository($appId: String!) {
    app(where: { id: $appId }) {
      id
      name
      color
      githubLastSync
      workspace {
        id
        gitOrganizations {
          id
          name
          type
        }
      }
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
