import {
  Dialog,
  EnumPanelStyle,
  Panel,
  Snackbar,
} from "@amplication/ui/design-system";
import { gql, useMutation } from "@apollo/client";
import { isEmpty } from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appContext";
import { AuthorizeResourceWithGitResult } from "../../models";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { formatError } from "../../util/error";
import "./AuthWithGit.scss";
import GitDialogsContainer from "./dialogs/GitDialogsContainer";
import {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "./dialogs/GitRepos/GithubRepos";
import ExistingConnectionsMenu from "./GitActions/ExistingConnectionsMenu";
import WizardRepositoryActions from "./GitActions/RepositoryActions/WizardRepositoryActions";
import { GitOrganizationFromGitRepository } from "./SyncWithGithubPage";
import { GitProviderConnectionList } from "./GitActions/GitProviderConnectionList";
import * as models from "../../models";

type DType = {
  getGitResourceInstallationUrl: AuthorizeResourceWithGitResult;
};

// eslint-disable-next-line
let triggerOnDone = () => {};
let triggerAuthFailed = () => {};

type Props = {
  gitProvider: models.EnumGitProvider;
  onDone: () => void;
  onGitRepositorySelected: (data: GitRepositorySelected) => void;
  onGitRepositoryCreated: (data: GitRepositoryCreatedData) => void;
  onGitRepositoryDisconnected: () => void;
  gitRepositorySelected?: GitRepositorySelected;
};

export const CLASS_NAME = "auth-with-git";

function AuthWithGit({
  gitProvider,
  onDone,
  onGitRepositorySelected,
  onGitRepositoryCreated,
  onGitRepositoryDisconnected,
  gitRepositorySelected,
}: Props) {
  const { currentWorkspace } = useContext(AppContext);
  const gitOrganizations = currentWorkspace?.gitOrganizations;
  const [gitOrganization, setGitOrganization] =
    useState<GitOrganizationFromGitRepository | null>(null);
  const [selectRepoOpen, setSelectRepoOpen] = useState<boolean>(false);
  const [createNewRepoOpen, setCreateNewRepoOpen] = useState(false);
  const [popupFailed, setPopupFailed] = useState(false);
  const openCreateNewRepo = useCallback(() => {
    setCreateNewRepoOpen(true);
  }, []);
  const [gitRepositorySelectedData, setGitRepositorySelectedData] =
    useState<GitRepositorySelected>(gitRepositorySelected || null);

  useEffect(() => {
    if (!gitRepositorySelected?.gitOrganizationId) return;

    setGitRepositorySelectedData(gitRepositorySelected);
  }, [gitRepositorySelected?.gitOrganizationId]);

  useEffect(() => {
    if (!gitOrganizations.length) return;
    const gitOrganizationRepo = gitRepositorySelectedData?.gitOrganizationId
      ? gitOrganizations.find(
          (organization) =>
            organization.id === gitRepositorySelectedData?.gitOrganizationId
        )
      : gitOrganizations[0];

    setGitOrganization(gitOrganizationRepo);
  }, [gitOrganizations]);

  const handleGitOrganizationChange = useCallback(
    (organization: GitOrganizationFromGitRepository) => {
      setGitOrganization(organization);
      setGitRepositorySelectedData(null);
      onGitRepositoryDisconnected();
    },
    [gitOrganization, gitRepositorySelectedData]
  );

  const { trackEvent } = useTracking();
  const [authWithGit, { error }] = useMutation<DType>(
    START_AUTH_APP_WITH_GITHUB,
    {
      onCompleted: (data) => {
        openSignInWindow(
          data.getGitResourceInstallationUrl.url,
          "auth with git"
        );
      },
    }
  );

  const [
    createRemoteRepository,
    { loading: createRepoLoading, error: createRepoError },
  ] = useMutation(CREATE_GIT_REMOTE_REPOSITORY);

  const handleCreateRepository = useCallback(
    (data: GitRepositoryCreatedData) => {
      createRemoteRepository({
        variables: {
          name: data.name,
          gitOrganizationId: data.gitOrganizationId,
          gitProvider: data.gitProvider,
          groupName: data.groupName,
          isPublic: data.isPublic,
        },
        onCompleted() {
          setCreateNewRepoOpen(false);
          onGitRepositoryCreated(data);
          setGitRepositorySelectedData({
            gitOrganizationId: data.gitOrganizationId,
            repositoryName: data.name,
            groupName: data.groupName,
            gitRepositoryUrl: data.gitRepositoryUrl,
            gitProvider: gitOrganization.provider,
          });
        },
      }).catch((error) => {});
      trackEvent({
        eventName: AnalyticsEventNames.GitHubRepositoryCreate,
      });
    },
    [createRemoteRepository, setGitRepositorySelectedData, trackEvent]
  );

  const handleSelectRepository = useCallback(
    (data: GitRepositorySelected) => {
      setSelectRepoOpen(false);
      onGitRepositorySelected(data);
      setGitRepositorySelectedData(data);
    },
    [setSelectRepoOpen, onGitRepositorySelected, setGitRepositorySelectedData]
  );

  const handleSelectRepoDialogOpen = useCallback(() => {
    setSelectRepoOpen(true);
  }, []);

  triggerOnDone = () => {
    onDone();
  };
  triggerAuthFailed = () => {
    setPopupFailed(true);
  };

  const handleOnDisconnectRepository = useCallback(() => {
    setGitRepositorySelectedData(null);
    onGitRepositoryDisconnected();
  }, [setGitRepositorySelectedData]);

  const [isSelectOrganizationDialogOpen, setSelectOrganizationDialogOpen] =
    useState(false);
  const openSelectOrganizationDialog = useCallback(() => {
    setSelectOrganizationDialogOpen(true);
  }, []);
  const closeSelectOrganizationDialog = useCallback(() => {
    setSelectOrganizationDialogOpen(false);
  }, []);

  const errorMessage = formatError(error);
  return (
    <>
      {gitOrganization && (
        <GitDialogsContainer
          gitOrganization={gitOrganization}
          isSelectRepositoryOpen={selectRepoOpen}
          isPopupFailed={popupFailed}
          gitCreateRepoOpen={createNewRepoOpen}
          gitProvider={gitProvider}
          src={"serviceWizard"}
          onSelectGitRepositoryDialogClose={() => {
            setSelectRepoOpen(false);
          }}
          setSelectRepoOpen={setSelectRepoOpen}
          openCreateNewRepo={openCreateNewRepo}
          onSelectGitRepository={handleSelectRepository}
          onGitCreateRepositoryClose={() => {
            setCreateNewRepoOpen(false);
          }}
          onPopupFailedClose={() => {
            setPopupFailed(false);
          }}
          onGitCreateRepository={handleCreateRepository}
          repoCreated={{
            isRepoCreateLoading: createRepoLoading,
            RepoCreatedError: createRepoError,
          }}
        />
      )}
      {isSelectOrganizationDialogOpen && (
        <Dialog
          title="Select Git Provider"
          className="git-organization-dialog"
          isOpen={isSelectOrganizationDialogOpen}
          onDismiss={closeSelectOrganizationDialog}
        >
          <GitProviderConnectionList
            onDone={onDone}
            setPopupFailed={setPopupFailed}
            onProviderSelect={closeSelectOrganizationDialog}
          />
        </Dialog>
      )}
      <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Transparent}>
        {isEmpty(gitOrganizations) ? (
          <GitProviderConnectionList
            onDone={onDone}
            setPopupFailed={setPopupFailed}
          />
        ) : (
          <div>
            <ExistingConnectionsMenu
              gitOrganizations={gitOrganizations}
              onSelectGitOrganization={handleGitOrganizationChange}
              selectedGitOrganization={gitOrganization}
              onAddGitOrganization={openSelectOrganizationDialog}
            />
            <WizardRepositoryActions
              onCreateRepository={() => {
                setCreateNewRepoOpen(true);
              }}
              onSelectRepository={handleSelectRepoDialogOpen}
              onDisconnectGitRepository={handleOnDisconnectRepository}
              selectedGitOrganization={gitOrganization}
              selectedGitRepository={gitRepositorySelectedData}
            />
          </div>
        )}
      </Panel>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
}

export default AuthWithGit;

const CREATE_GIT_REMOTE_REPOSITORY = gql`
  mutation createRemoteGitRepository(
    $gitProvider: EnumGitProvider!
    $gitOrganizationId: String!
    $name: String!
    $isPublic: Boolean!
    $groupName: String
  ) {
    createRemoteGitRepository(
      data: {
        name: $name
        isPublic: $isPublic
        gitOrganizationId: $gitOrganizationId
        gitProvider: $gitProvider
        gitOrganizationType: Organization
        groupName: $groupName
      }
    )
  }
`;

const START_AUTH_APP_WITH_GITHUB = gql`
  mutation getGitResourceInstallationUrl($gitProvider: EnumGitProvider!) {
    getGitResourceInstallationUrl(data: { gitProvider: $gitProvider }) {
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
