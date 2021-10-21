import React from "react";
import { match } from "react-router-dom";
import { Snackbar } from "@rmwc/snackbar";
import { Icon } from "@rmwc/icon";

import { useQuery } from "@apollo/client";
import * as models from "../../models";
import "./SyncWithGithubPage.scss";
import AuthAppWithGithub from "./AuthAppWithGithub";
import { GET_APPLICATION } from "../ApplicationHome";
import { formatError } from "../../util/error";

const CLASS_NAME = "sync-with-github-page";

type Props = {
  match: match<{ application: string }>;
};

function SyncWithGithubPage({ match }: Props) {
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
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <Icon icon={{ icon: "github", size: "xlarge" }} />
        <div className={`${CLASS_NAME}__message`}>
          Enable sync with GitHub to automatically push the generated code of
          your application and create a Pull Request in your GitHub repository
          every time you commit your changes.
        </div>
      </div>

      {data?.app && <AuthAppWithGithub app={data.app} onDone={refetch} />}

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
}

export default SyncWithGithubPage;
