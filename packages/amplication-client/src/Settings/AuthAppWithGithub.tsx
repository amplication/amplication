import React, { useCallback, useState } from "react";
import { Icon } from "@rmwc/icon";
import { isEmpty } from "lodash";
import { Snackbar } from "@rmwc/snackbar";
import { gql, useMutation } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import GithubRepos from "./GithubRepos";
import GithubSyncDetails from "./GithubSyncDetails";
import { Button, EnumButtonStyle } from "../Components/Button";

import {
  PanelCollapsible,
  Toggle,
  Dialog,
  ConfirmationDialog,
} from "@amplication/design-system";
import "./AuthAppWithGithub.scss";

type DType = {
  startAuthorizeAppWithGithub: models.AuthorizeAppWithGithubResult;
};

// eslint-disable-next-line
let triggerOnDone = () => {};

type Props = {
  app: models.App;
  onDone: () => void;
};

const CLASS_NAME = "auth-app-with-github";

const CONFIRM_BUTTON = { label: "Disable Sync" };
const DISMISS_BUTTON = { label: "Dismiss" };

function AuthAppWithGithub({ app, onDone }: Props) {
  const [selectRepoOpen, setSelectRepoOpen] = useState<boolean>(false);
  const [confirmRemove, setConfirmRemove] = useState<boolean>(false);

  const [authWithGithub, { loading, error }] = useMutation<DType>(
    START_AUTH_APP_WITH_GITHUB,
    {
      onCompleted: (data) => {
        openSignInWindow(
          data.startAuthorizeAppWithGithub.url,
          "auth with github"
        );
      },
    }
  );

  const [
    removeAuthWithGithub,
    { loading: removeLoading, error: removeError },
  ] = useMutation<{
    removeAuthorizeAppWithGithub: models.App;
  }>(REMOVE_AUTH_APP_WITH_GITHUB, {
    onCompleted: () => {
      onDone();
    },
  });

  const handleSelectRepoDialogDismiss = useCallback(() => {
    setSelectRepoOpen(false);
  }, []);

  const handleSelectRepoDialogOpen = useCallback(() => {
    setSelectRepoOpen(true);
  }, []);

  const handleAuthWithGithubClick = useCallback(
    (data) => {
      if (isEmpty(app.githubTokenCreatedDate)) {
        // eventData={{
        //   eventName: "authAppInWithGitHub",
        // }}
        authWithGithub({
          variables: {
            appId: app.id,
          },
        }).catch(console.error);
      } else {
        setConfirmRemove(true);
      }
    },
    [authWithGithub, app]
  );

  const handleDismissRemove = useCallback(() => {
    setConfirmRemove(false);
  }, [setConfirmRemove]);

  const handleConfirmRemoveAuth = useCallback(() => {
    // eventData={{
    //   eventName: "authAppInWithGitHub",
    // }}
    setConfirmRemove(false);
    removeAuthWithGithub({
      variables: {
        appId: app.id,
      },
    }).catch(console.error);
  }, [removeAuthWithGithub, app]);

  triggerOnDone = () => {
    onDone();
    setSelectRepoOpen(true);
  };
  const errorMessage = formatError(error || removeError);

  const isAuthenticatedWithGithub = !isEmpty(app.githubTokenCreatedDate);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmRemove}
        title={`Disable Sync with GitHub`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message="Are you sure you want to disable sync with GitHub?"
        onConfirm={handleConfirmRemoveAuth}
        onDismiss={handleDismissRemove}
      />
      <Dialog
        className="select-repo-dialog"
        isOpen={selectRepoOpen}
        title="Select Repository"
        onDismiss={handleSelectRepoDialogDismiss}
      >
        <GithubRepos
          applicationId={app.id}
          onCompleted={handleSelectRepoDialogDismiss}
        />
      </Dialog>
      <PanelCollapsible
        manualCollapseDisabled
        initiallyOpen
        collapseEnabled={isAuthenticatedWithGithub}
        className={CLASS_NAME}
        headerContent={
          <>
            <Icon icon={{ icon: "github", size: "large" }} />
            <span className="spacer">Sync With GitHub</span>
            <Toggle
              title="Sync with Github"
              onValueChange={handleAuthWithGithubClick}
              checked={isAuthenticatedWithGithub}
              disabled={loading || removeLoading || isEmpty(app)}
            />
          </>
        }
      >
        {isAuthenticatedWithGithub && (
          <div className={`${CLASS_NAME}__body`}>
            {!app.githubSyncEnabled ? (
              <>
                <div className={`${CLASS_NAME}__details`}>
                  No repository was selected
                </div>

                <div className={`${CLASS_NAME}__action`}>
                  <Button
                    buttonStyle={EnumButtonStyle.Primary}
                    onClick={handleSelectRepoDialogOpen}
                  >
                    Select Repository
                  </Button>
                </div>
              </>
            ) : (
              <GithubSyncDetails app={app} />
            )}
          </div>
        )}
      </PanelCollapsible>

      <Snackbar open={Boolean(error || removeError)} message={errorMessage} />
    </>
  );
}

export default AuthAppWithGithub;

const START_AUTH_APP_WITH_GITHUB = gql`
  mutation startAuthorizeAppWithGithub($appId: String!) {
    startAuthorizeAppWithGithub(where: { id: $appId }) {
      url
    }
  }
`;

const REMOVE_AUTH_APP_WITH_GITHUB = gql`
  mutation removeAuthorizeAppWithGithub($appId: String!) {
    removeAuthorizeAppWithGithub(where: { id: $appId }) {
      id
      createdAt
      updatedAt
      name
      description
      color
      githubTokenCreatedDate
      githubSyncEnabled
      githubRepo
      githubLastSync
      githubLastMessage
    }
  }
`;

const receiveMessage = (event: any) => {
  const { data } = event;
  if (data.completed) {
    triggerOnDone();
  }
};

let windowObjectReference: any = null;

const openSignInWindow = (url: string, name: string) => {
  // remove any existing event listeners
  window.removeEventListener("message", receiveMessage);

  const width = 600;
  const height = 700;

  const left = (window.screen.width - width) / 2;
  const top = 100;

  // window features
  const strWindowFeatures = `toolbar=no, menubar=no, width=${width}, height=${height}, top=${top}, left=${left}`;

  windowObjectReference = window.open(url, name, strWindowFeatures);
  windowObjectReference.focus();

  // add the listener for receiving a message from the popup
  window.addEventListener("message", (event) => receiveMessage(event), false);
};
