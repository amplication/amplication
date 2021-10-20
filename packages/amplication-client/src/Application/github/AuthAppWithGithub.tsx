import { EnumPanelStyle, Panel, Toggle } from "@amplication/design-system";
import { gql, useMutation } from "@apollo/client";
import { MDCSwitchFoundation } from "@material/switch";
import { Icon } from "@rmwc/icon";
import { Snackbar } from "@rmwc/snackbar";
import { isEmpty } from "lodash";
import React, { useCallback, useRef, useState } from "react";
import { Button, EnumButtonStyle } from "../../Components/Button";
import * as models from "../../models";
import GithubSyncDetails from "../../Settings/GithubSyncDetails";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import "./AuthAppWithGithub.scss";
import GitDialogsContainer from "./dialogs/GitDialogsContainer";

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

function AuthAppWithGithub({ app, onDone }: Props) {
  const [selectRepoOpen, setSelectRepoOpen] = useState<boolean>(false);
  const [confirmRemove, setConfirmRemove] = useState<boolean>(false);
  const [createNewRepoOpen, setCreateNewRepoOpen] = useState(false);
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
      <GitDialogsContainer
        app={app}
        handleSelectRepoDialogDismiss={handleSelectRepoDialogDismiss}
        selectRepoOpen={selectRepoOpen}
        handlePopupFailedClose={handlePopupFailedClose}
        popupFailed={popupFailed}
        gitCreateRepoOpen={createNewRepoOpen}
        setGitCreateRepo={setCreateNewRepoOpen}
        sourceControlService={models.EnumSourceControlService.Github}
        confirmRemove={confirmRemove}
        handleConfirmRemoveAuth={handleConfirmRemoveAuth}
        handleDismissRemove={handleDismissRemove}
      />

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
                  <div className={`${CLASS_NAME}__actions`}>
                    <div className={`${CLASS_NAME}__action`}>
                      <Button
                        buttonStyle={EnumButtonStyle.Primary}
                        onClick={() => {
                          setCreateNewRepoOpen(true);
                        }}
                      >
                        Create repository
                      </Button>
                    </div>
                    <div className={`${CLASS_NAME}__action`}>
                      <Button
                        buttonStyle={EnumButtonStyle.Primary}
                        onClick={handleSelectRepoDialogOpen}
                      >
                        Select repository
                      </Button>
                    </div>
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
                The selected repository must not be empty.
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
