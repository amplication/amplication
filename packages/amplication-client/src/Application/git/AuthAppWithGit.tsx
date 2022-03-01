import { EnumPanelStyle, Panel, Snackbar } from "@amplication/design-system";
import { gql, useMutation } from "@apollo/client";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { AuthorizeAppWithGitResult, EnumGitProvider } from "../../models";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import "./AuthAppWithGit.scss";
import GitDialogsContainer from "./dialogs/GitDialogsContainer";
import ExistingConnectionsMenu from "./GitActions/ExistingConnectionsMenu";
import NewConnection from "./GitActions/NewConnection";
import RepositoryActions from "./GitActions/RepositoryActions/RepositoryActions";
import GitSyncNotes from "./GitSyncNotes";
import {
  AppWithGitRepository,
  GitOrganizationFromGitRepository,
} from "./SyncWithGithubPage";

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

function AuthAppWithGit({ app, onDone }: Props) {
  const [
    gitOrganization,
    setGitOrganization,
  ] = useState<GitOrganizationFromGitRepository | null>(null);
  useEffect(() => {
    if (app.gitRepository?.gitOrganization) {
      setGitOrganization(app.gitRepository?.gitOrganization);
    } else if (app.workspace.gitOrganizations.length === 1) {
      setGitOrganization(app.workspace.gitOrganizations[0]);
    } else {
      setGitOrganization(null);
    }
  }, [app.gitRepository?.gitOrganization, app.workspace.gitOrganizations]);

  const [selectRepoOpen, setSelectRepoOpen] = useState<boolean>(false);
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

  const handleSelectRepoDialogDismiss = useCallback(() => {
    setSelectRepoOpen(false);
  }, []);

  const handleSelectRepoDialogOpen = useCallback(() => {
    setSelectRepoOpen(true);
  }, []);
  const handleAuthWithGitClick = useCallback(() => {
    trackEvent({
      eventName: "startAuthAppWithGitHub",
    });
    authWithGit({
      variables: {
        sourceControlService: "Github",
      },
    }).catch(console.error);
  }, [authWithGit, trackEvent]);

  const handlePopupFailedClose = () => {
    setPopupFailed(false);
  };
  triggerOnDone = () => {
    onDone();
  };
  triggerAuthFailed = () => {
    setPopupFailed(true);
  };
  const errorMessage = formatError(error);
  return (
    <>
      {gitOrganization && (
        <GitDialogsContainer
          app={app}
          gitOrganizationId={gitOrganization.id}
          onSelectGitRepositoryDialogClose={handleSelectRepoDialogDismiss}
          selectRepoOpen={selectRepoOpen}
          handlePopupFailedClose={handlePopupFailedClose}
          popupFailed={popupFailed}
          gitCreateRepoOpen={createNewRepoOpen}
          setGitCreateRepo={setCreateNewRepoOpen}
          gitProvider={EnumGitProvider.Github}
          gitOrganizationName={gitOrganization.name}
        />
      )}
      <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Transparent}>
        <div className={`${CLASS_NAME}__actions`}>
          {isEmpty(app.workspace.gitOrganizations) ? (
            <NewConnection
              onSyncNewGitOrganizationClick={handleAuthWithGitClick}
            />
          ) : (
            <ExistingConnectionsMenu
              gitOrganizations={app.workspace.gitOrganizations}
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
            currentConnectedGitRepository={app.gitRepository}
          />
        )}
        <GitSyncNotes />
      </Panel>

      <Snackbar open={Boolean(error)} message={errorMessage} />
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
