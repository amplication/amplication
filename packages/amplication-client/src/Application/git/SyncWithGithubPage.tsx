import React from "react";
import { match } from "react-router-dom";
import { Snackbar, Icon } from "@amplication/design-system";

import { gql, useQuery } from "@apollo/client";
import * as models from "../../models";
import "./SyncWithGithubPage.scss";
import AuthAppWithGithub from "./AuthAppWithGithub";
import { formatError } from "../../util/error";
import PageContent from "../../Layout/PageContent";
import useNavigationTabs from "../../Layout/UseNavigationTabs";

const CLASS_NAME = "sync-with-github-page";

type Props = {
  match: match<{ application: string }>;
};
const NAVIGATION_KEY = "GITHUB";
function SyncWithGithubPage({ match }: Props) {
  const { application } = match.params;

  const { data, error, refetch } = useQuery<{
    app: models.App;
  }>(GET_APP_GIT_REPOSITORY, {
    variables: {
      appId: application,
    },
  });

  useNavigationTabs(application, NAVIGATION_KEY, match.url, `GitHub`);
  const errorMessage = formatError(error);

  return (
    <PageContent>
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__header`}>
          <h1>
            <Icon icon="github" size="xlarge" />
            Sync with GitHub
          </h1>
        </div>
        <div className={`${CLASS_NAME}__message`}>
          Enable sync with GitHub to automatically push the generated code of
          your application and create a Pull Request in your GitHub repository
          every time you commit your changes.
        </div>
        {data?.app && <AuthAppWithGithub app={data.app} onDone={refetch} />}

        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    </PageContent>
  );
}

export default SyncWithGithubPage;

const GET_APP_GIT_REPOSITORY = gql`
  query getAppGitRepository($appId: String!) {
    app(where: { id: $appId }) {
      id
      gitRepository {
        id
        name
        gitOrganization {
          id
        }
      }
    }
  }
`;
