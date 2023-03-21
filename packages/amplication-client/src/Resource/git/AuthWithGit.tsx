import { EnumPanelStyle, Panel, Snackbar } from "@amplication/design-system";
import { gql, useMutation } from "@apollo/client";
import { isEmpty } from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appContext";
import { AuthorizeResourceWithGitResult, EnumGitProvider } from "../../models";
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
import NewConnection from "./GitActions/NewConnection";
import WizardRepositoryActions from "./GitActions/RepositoryActions/WizardRepositoryActions";
import GitSyncNotes from "./GitSyncNotes";
import { GitOrganizationFromGitRepository } from "./SyncWithGithubPage";

type DType = {
  getGitResourceInstallationUrl: AuthorizeResourceWithGitResult;
};

// eslint-disable-next-line
let triggerOnDone = () => {};
let triggerAuthFailed = () => {};

type Props = {
  onDone: () => void;
  onGitRepositorySelected: (data: GitRepositorySelected) => void;
  onGitRepositoryCreated: (data: GitRepositoryCreatedData) => void;
  gitRepositorySelected?: GitRepositorySelected;
};

export const CLASS_NAME = "auth-with-git";

function AuthWithGit({
  onDone,
  onGitRepositorySelected,
  onGitRepositoryCreated,
  gitRepositorySelected,
}: Props) {
  const { currentWorkspace } = useContext(AppContext);
  const gitOrganizations = currentWorkspace?.gitOrganizations;
  const [gitOrganization, setGitOrganization] =
    useState<GitOrganizationFromGitRepository | null>(null);
  const [selectRepoOpen, setSelectRepoOpen] = useState<boolean>(false);
  const [createNewRepoOpen, setCreateNewRepoOpen] = useState(false);
  const [popupFailed, setPopupFailed] = useState(false);

  const [gitRepositorySelectedData, setGitRepositorySelectedData] =
    useState<GitRepositorySelected>(gitRepositorySelected || null);

  useEffect(() => {
    if (!gitRepositorySelected?.gitOrganizationId) return;

    setGitRepositorySelectedData(gitRepositorySelected);
  }, [gitRepositorySelected?.gitOrganizationId]);

  useEffect(() => {
    if (
      !gitOrganizations.length ||
      !gitRepositorySelectedData?.gitOrganizationId
    )
      return;
    const gitOrganizationRepo =
      gitOrganizations.findIndex(
        (organization) =>
          organization.id === gitRepositorySelectedData.gitOrganizationId
      ) || 0;
    setGitOrganization(gitOrganizations[gitOrganizationRepo]);
  }, [gitOrganizations, gitRepositorySelectedData]);

  const handleGitOrganizationChange = useCallback(
    (organization: GitOrganizationFromGitRepository) => {
      setGitOrganization(organization);
      setGitRepositorySelectedData(null);
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
          gitProvider: EnumGitProvider.Github,
          public: data.public,
        },
        onCompleted() {
          setCreateNewRepoOpen(false);
          onGitRepositoryCreated(data);
          setGitRepositorySelectedData({
            gitOrganizationId: data.gitOrganizationId,
            repositoryName: data.name,
            gitRepositoryUrl: `https://github.com/${data.name}`,
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

  const handleAuthWithGitClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.GitHubAuthResourceStart,
    });
    authWithGit({
      variables: {
        gitProvider: "Github",
      },
    }).catch(console.error);
  }, [authWithGit, trackEvent]);

  triggerOnDone = () => {
    onDone();
  };
  triggerAuthFailed = () => {
    setPopupFailed(true);
  };

  const handleOnDisconnectRepository = useCallback(() => {
    setGitRepositorySelectedData(null);
  }, [setGitRepositorySelectedData]);

  const errorMessage = formatError(error);
  return (
    <>
      {gitOrganization && (
        <GitDialogsContainer
          gitOrganizationId={gitOrganization.id}
          isSelectRepositoryOpen={selectRepoOpen}
          isPopupFailed={popupFailed}
          gitCreateRepoOpen={createNewRepoOpen}
          gitProvider={EnumGitProvider.Github}
          gitOrganizationName={gitOrganization.name}
          src={"serviceWizard"}
          onSelectGitRepositoryDialogClose={() => {
            setSelectRepoOpen(false);
          }}
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
      <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Transparent}>
        <div className={`${CLASS_NAME}__selectOrganization`}>
          Select Organization
        </div>
        {isEmpty(gitOrganizations) ? (
          <NewConnection
            onSyncNewGitOrganizationClick={handleAuthWithGitClick}
            provider={EnumGitProvider.Github}
          />
        ) : (
          <ExistingConnectionsMenu
            gitOrganizations={gitOrganizations}
            onSelectGitOrganization={handleGitOrganizationChange}
            selectedGitOrganization={gitOrganization}
            onAddGitOrganization={handleAuthWithGitClick}
          />
        )}

        <WizardRepositoryActions
          onCreateRepository={() => {
            setCreateNewRepoOpen(true);
          }}
          onSelectRepository={handleSelectRepoDialogOpen}
          onDisconnectGitRepository={handleOnDisconnectRepository}
          selectedGitOrganization={gitOrganization}
          selectedGitRepository={gitRepositorySelectedData}
        />

        <GitSyncNotes />
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
    $public: Boolean!
  ) {
    createRemoteGitRepository(
      data: {
        name: $name
        public: $public
        gitOrganizationId: $gitOrganizationId
        gitProvider: $gitProvider
        gitOrganizationType: Organization
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
