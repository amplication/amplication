import React, { useCallback, useRef, useState } from "react";
import { MDCSwitchFoundation } from "@material/switch";
import { Icon } from "@rmwc/icon";
import { isEmpty } from "lodash";
import { Snackbar } from "@rmwc/snackbar";
import { gql, useMutation } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import GithubRepos from "./GithubRepos";
import GithubSyncDetails from "./GithubSyncDetails";
import { Button, EnumButtonStyle } from "../Components/Button";
import { useTracking } from "../util/analytics";

import {
  Panel,
  EnumPanelStyle,
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
let triggerAuthFailed = () => {};

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
  const [popupFailed, setPopupFailed] = useState(false);
  const { trackEvent } = useTracking();

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
        trackEvent({
          eventName: "startAuthAppWithGitHub",
        });
        authWithGithub({
          variables: {
            appId: app.id,
          },
        }).catch(console.error);
      } else {
        setConfirmRemove(true);
      }
    },
    [authWithGithub, app, trackEvent]
  );

  const MDCSwitchRef = useRef<MDCSwitchFoundation>(null);
  const handleDismissRemove = useCallback(() => {
    setConfirmRemove(false);
    // `handleAuthWithGithubClick -> setConfirmRemove` is triggered by `Toggle.onValueChange`.
    // Behind the scenes, a `MDCSwitchFoundation.setChecked(false)` was triggered.
    // now that the toggle is cancelled, should explicitly call `MDCSwitchFoundation.setChecked(true)`.
    MDCSwitchRef.current?.setChecked(true);
  }, [setConfirmRemove, MDCSwitchRef]);

  const handleConfirmRemoveAuth = useCallback(() => {
    trackEvent({
      eventName: "removeAuthAppWithGitHub",
    });
    setConfirmRemove(false);
    removeAuthWithGithub({
      variables: {
        appId: app.id,
      },
    }).catch(console.error);
  }, [removeAuthWithGithub, app, trackEvent]);
  const handlePopupFailedClose = () => {
    MDCSwitchRef.current?.setChecked(false);
    setPopupFailed(false);
  };
  triggerOnDone = () => {
    onDone();
  };
  triggerAuthFailed = () => {
    setPopupFailed(true);
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
        title="Select GitHub Repository"
        onDismiss={handleSelectRepoDialogDismiss}
      >
        <GithubRepos
          applicationId={app.id}
          onCompleted={handleSelectRepoDialogDismiss}
        />
      </Dialog>
      <Dialog
        className="popup-failed-dialog"
        isOpen={popupFailed}
        title="Popup failed to load"
        onDismiss={handlePopupFailedClose}
      >
        Please make sure that you allow popup windows in the browser
      </Dialog>
      <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Transparent}>
        <Toggle
          label="Sync with GitHub"
          title="Sync with Github"
          foundationRef={MDCSwitchRef}
          onValueChange={handleAuthWithGithubClick}
          checked={isAuthenticatedWithGithub}
          disabled={loading || removeLoading || isEmpty(app)}
        />
        <div className={`${CLASS_NAME}__body`}>
          {isAuthenticatedWithGithub && (
            <Panel
              className={`${CLASS_NAME}__auth`}
              panelStyle={EnumPanelStyle.Bordered}
            >
              {!app.githubSyncEnabled ? (
                <div className={`${CLASS_NAME}__select-repo`}>
                  <div className={`${CLASS_NAME}__select-repo__details`}>
                    <Icon icon={{ size: "xsmall", icon: "info_circle" }} />
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
                </div>
              ) : (
                <GithubSyncDetails app={app} />
              )}
            </Panel>
          )}
          <div className={`${CLASS_NAME}__notice`}>
            Please note:
            <ul>
              <li>
                <Icon icon={{ size: "xsmall", icon: "check_circle" }} />
                The changes will be pushed to the root of the selected
                repository, using Pull Requests.
              </li>
              <li>
                <Icon icon={{ size: "xsmall", icon: "check_circle" }} />
                The selected repository must not be empty, so please create at
                least one file in the root.
              </li>
              <li>
                <Icon icon={{ size: "xsmall", icon: "check_circle" }} />
                <div>
                  <a href="https://github.com/new" target="github_repo">
                    Click here
                  </a>{" "}
                  to create a new repository. Please select{" "}
                  <b>Initialize this repository with a README file</b> to make
                  sure it is not empty.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Panel>

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
  if (windowObjectReference) {
    windowObjectReference.focus();
  } else {
    triggerAuthFailed();
  }

  // add the listener for receiving a message from the popup
  window.addEventListener("message", (event) => receiveMessage(event), false);
};
