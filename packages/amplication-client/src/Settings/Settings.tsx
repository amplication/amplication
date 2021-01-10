import React from "react";
import { match } from "react-router-dom";
import { Snackbar } from "@rmwc/snackbar";
import { CircularProgress } from "@rmwc/circular-progress";
import { isEmpty } from "lodash";
import PageContent from "../Layout/PageContent";

import FloatingToolbar from "../Layout/FloatingToolbar";
import { useQuery } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import { GET_APPLICATION } from "../Application/ApplicationHome";
import "./Settings.scss";
import AuthAppWithGithub from "./AuthAppWithGithub";
import GithubRepos from "./GithubRepos";
import GithubSyncDetails from "./GithubSyncDetails";

import useBreadcrumbs from "../Layout/use-breadcrumbs";
const CLASS_NAME = "settings-page";

type Props = {
  match: match<{ application: string }>;
};

function SettingsPage({ match }: Props) {
  useBreadcrumbs(match.url, "Settings");
  const { application } = match.params;

  const { data, error, loading, refetch } = useQuery<{
    app: models.App;
  }>(GET_APPLICATION, {
    variables: {
      id: application,
    },
  });

  const errorMessage = formatError(error);

  return (
    <PageContent className={CLASS_NAME} withFloatingBar>
      <main>
        <FloatingToolbar />
        {loading ? (
          <CircularProgress />
        ) : isEmpty(data?.app.githubTokenCreatedDate) ? (
          <AuthAppWithGithub applicationId={application} onDone={refetch} />
        ) : !data?.app.githubSyncEnabled ? (
          <GithubRepos applicationId={application} />
        ) : (
          <GithubSyncDetails app={data.app} />
        )}
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </main>
    </PageContent>
  );
}

export default SettingsPage;
