import React, { useCallback } from "react";
import { Snackbar } from "@rmwc/snackbar";
import { gql, useMutation } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import { Button } from "@amplication/design-system";

const CLASS_NAME = "github-repos";

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

  return (
    <div className={CLASS_NAME}>
      <div>
        <div>Repo name: {app.githubRepo}</div>
        <div>Last sync: {app.githubLastSync}</div>
        <div>Last Message: {app.githubLastMessage}</div>

        <Button onClick={handleDisableSync}>Disable Sync</Button>
        <br />
        <br />
        <br />
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
