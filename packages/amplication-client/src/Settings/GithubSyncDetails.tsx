import React, { useCallback } from "react";
import { Icon } from "@rmwc/icon";
import { Snackbar } from "@rmwc/snackbar";
import { gql, useMutation } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import { Button, EnumButtonStyle } from "@amplication/design-system";
import "./GithubSyncDetails.scss";

const CLASS_NAME = "github-repo-details";

type Props = {
  app: models.App;
};

function GithubSyncDetails({ app }: Props) {
  const [disableSyncWithGithub, { error: errorUpdate }] = useMutation<
    models.App
  >(DISABLE_SYNC_WITH_GITHUB);

  const handleDisableSync = useCallback(() => {
    disableSyncWithGithub({
      variables: {
        appId: app.id,
      },
    }).catch(console.error);
  }, [disableSyncWithGithub, app]);

  const errorMessage = formatError(errorUpdate);
  const repoUrl = `https://github.com/${app.githubRepo}`;

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__body`}>
        <div className={`${CLASS_NAME}__details`}>
          <div className={`${CLASS_NAME}__name`}>{app.githubRepo}</div>
          <div>
            <a href={repoUrl} target="github_repo">
              {repoUrl}
            </a>
          </div>
        </div>

        <div className={`${CLASS_NAME}__action`}>
          <Button
            buttonStyle={EnumButtonStyle.Secondary}
            onClick={handleDisableSync}
          >
            Change Repo
          </Button>
        </div>
      </div>
      <div className={`${CLASS_NAME}__status`}>
        <Icon icon={{ size: "xsmall", icon: "info_circle" }} />
        We will automatically create a Pull Request in this repo every time you
        commit your changes.
      </div>
      <Snackbar open={Boolean(errorUpdate)} message={errorMessage} />
    </div>
  );
}

export default GithubSyncDetails;

const DISABLE_SYNC_WITH_GITHUB = gql`
  mutation appDisableSyncWithGithubRepo($appId: String!) {
    appDisableSyncWithGithubRepo(where: { id: $appId }) {
      id
      githubSyncEnabled
      githubRepo
      githubBranch
    }
  }
`;
