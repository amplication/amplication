import { EnumPanelStyle, Panel, Snackbar } from "@amplication/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import { MDCSwitchFoundation } from "@material/switch";
import { isEmpty } from "lodash";
import React, { useCallback, useRef, useState } from "react";
import {
  App,
  AuthorizeAppWithGitResult,
  EnumGitProvider,
  GitOrganization,
} from "../../models";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import "./AuthAppWithGit.scss";
import GitDialogsContainer from "./dialogs/GitDialogsContainer";
import ExistingConnectionsMenu from "./GitActions/ExistingConnectionsMenu";
import NewConnection from "./GitActions/NewConnection";
import RepositoryActions from "./GitActions/RepositoryActions/RepositoryActions";
import GitSyncNotes from "./GitSyncNotes";
import { AppWithGitRepository } from "./SyncWithGithubPage";

type DType = {
  getGitAppInstallationUrl: AuthorizeAppWithGitResult;
};

// eslint-disable-next-line
let triggerOnDone = () => {};
let triggerAuthFailed = () => {};

type Props = {
  app: AppWithGitRepository;
  onDone: () => void;
};

export const CLASS_NAME = "auth-app-with-github";

function AuthAppWithGit({ app: { app }, onDone }: Props) {
  const { data } = useQuery<{
    gitOrganizations: [
      {
        id: string;
        name: string;
      }
    ];
  }>(GET_GIT_ORGANIZATIONS);
  const [
    gitOrganization,
    setGitOrganization,
  ] = useState<GitOrganization | null>(data?.gitOrganizations[0] || null);
  const [selectRepoOpen, setSelectRepoOpen] = useState<boolean>(false);
  const [confirmRemove, setConfirmRemove] = useState<boolean>(false);
  const [createNewRepoOpen, setCreateNewRepoOpen] = useState(false);
  const [popupFailed, setPopupFailed] = useState(false);
  const { trackEvent } = useTracking();
  const [authWithGit, { error }] = useMutation<DType>(
    START_AUTH_APP_WITH_GITHUB,
    {
      onCompleted: (data) => {
        openSignInWindow(data.getGitAppInstallationUrl.url, "auth with git");
      },
    }
  );

  const [removeAuthWithGit, { error: removeError }] = useMutation<{
    removeAuthorizeAppWithGithub: App;
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
  const handleAuthWithGitClick = useCallback(() => {
    if (isEmpty(app.githubTokenCreatedDate)) {
      trackEvent({
        eventName: "startAuthAppWithGitHub",
      });
      console.log({ app });

      authWithGit({
        variables: {
          sourceControlService: "Github",
        },
      }).catch(console.error);
    } else {
      setConfirmRemove(true);
    }
  }, [authWithGit, app, trackEvent]);

  const MDCSwitchRef = useRef<MDCSwitchFoundation>(null);
  const handleDismissRemove = useCallback(() => {
    setConfirmRemove(false);
    // `handleAuthWithGitClick -> setConfirmRemove` is triggered by `Toggle.onValueChange`.
    // Behind the scenes, a `MDCSwitchFoundation.setChecked(false)` was triggered.
    // now that the toggle is cancelled, should explicitly call `MDCSwitchFoundation.setChecked(true)`.
    MDCSwitchRef.current?.setChecked(true);
  }, [setConfirmRemove, MDCSwitchRef]);

  const handleConfirmRemoveAuth = useCallback(() => {
    trackEvent({
      eventName: "removeAuthAppWithGitHub",
    });
    setConfirmRemove(false);
    removeAuthWithGit({
      variables: {
        appId: app.id,
      },
    }).catch(console.error);
  }, [removeAuthWithGit, app, trackEvent]);
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

  return (
    <>
      {gitOrganization && (
        <GitDialogsContainer
          app={app}
          gitOrganizationId={gitOrganization.id}
          handleSelectRepoDialogDismiss={handleSelectRepoDialogDismiss}
          selectRepoOpen={selectRepoOpen}
          handlePopupFailedClose={handlePopupFailedClose}
          popupFailed={popupFailed}
          gitCreateRepoOpen={createNewRepoOpen}
          setGitCreateRepo={setCreateNewRepoOpen}
          sourceControlService={EnumGitProvider.Github}
          confirmRemove={confirmRemove}
          handleConfirmRemoveAuth={handleConfirmRemoveAuth}
          handleDismissRemove={handleDismissRemove}
        />
      )}
      <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Transparent}>
        <div className={`${CLASS_NAME}__actions`}>
          {isEmpty(data?.gitOrganizations) ? (
            <NewConnection
              onSyncNewGitOrganizationClick={handleAuthWithGitClick}
            />
          ) : (
            <ExistingConnectionsMenu
              gitOrganizations={data?.gitOrganizations}
              onSelectGitOrganization={(organization) => {
                setGitOrganization(organization);
              }}
              selectedGitOrganization={gitOrganization}
              onAddGitOrganization={handleAuthWithGitClick}
            />
          )}
        </div>
        {gitOrganization && (
          <RepositoryActions
            onClickCreateRepository={() => {
              setCreateNewRepoOpen(true);
            }}
            onClickSelectRepository={handleSelectRepoDialogOpen}
          />
        )}
        <GitSyncNotes />
      </Panel>

      <Snackbar open={Boolean(error || removeError)} message={errorMessage} />
    </>
  );
}

export default AuthAppWithGit;

const START_AUTH_APP_WITH_GITHUB = gql`
  mutation getGitAppInstallationUrl($sourceControlService: EnumGitProvider!) {
    getGitAppInstallationUrl(
      data: { sourceControlService: $sourceControlService }
    ) {
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

const GET_GIT_ORGANIZATIONS = gql`
  {
    gitOrganizations(where: {}) {
      id
      name
    }
  }
`;
