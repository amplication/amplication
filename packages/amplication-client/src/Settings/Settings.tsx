import React from "react";
import { match } from "react-router-dom";
import { Snackbar } from "@rmwc/snackbar";
import PageContent from "../Layout/PageContent";

import FloatingToolbar from "../Layout/FloatingToolbar";
import { useQuery } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import { GET_APPLICATION } from "../Application/ApplicationHome";
import "./Settings.scss";
import AuthAppWithGithub from "./AuthAppWithGithub";

import useBreadcrumbs from "../Layout/use-breadcrumbs";
const CLASS_NAME = "settings-page";

type Props = {
  match: match<{ application: string }>;
};

function SettingsPage({ match }: Props) {
  useBreadcrumbs(match.url, "Settings");
  const { application } = match.params;

  const { data, error, refetch } = useQuery<{
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
        <h1>Sync with GitHub</h1>
        <div className={`${CLASS_NAME}__message`}>
          Enable sync with GitHub to automatically push the generated code of
          your application and create a Pull Request in your GitHub repository
          every time you commit your changes.
        </div>
        {data?.app && <AuthAppWithGithub app={data.app} onDone={refetch} />}

        <Snackbar open={Boolean(error)} message={errorMessage} />
      </main>
    </PageContent>
  );
}

export default SettingsPage;
