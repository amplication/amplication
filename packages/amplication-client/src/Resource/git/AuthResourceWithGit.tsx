import { EnumPanelStyle, Panel, Snackbar } from "@amplication/ui/design-system";
import { gql, useMutation } from "@apollo/client";
import { useCallback, useContext, useEffect, useState } from "react";
import * as models from "../../models";
import { AppContext } from "../../context/appContext";
import {
  AuthorizeResourceWithGitResult,
  CreateGitRepositoryInput,
  EnumGitProvider,
  Resource,
} from "../../models";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { formatError } from "../../util/error";
import "./AuthResourceWithGit.scss";
import GitDialogsContainer from "./dialogs/GitDialogsContainer";
import ExistingConnectionsMenu from "./GitActions/ExistingConnectionsMenu";
import GitSyncNotes from "./GitSyncNotes";
import { GitOrganizationFromGitRepository } from "./SyncWithGithubPage";
import { isEmpty } from "lodash";
import NewConnection from "./GitActions/NewConnection";
import {
  CONNECT_GIT_REPOSITORY,
  GitRepositorySelected,
} from "./dialogs/GitRepos/GithubRepos";
import RepositoryActions from "./GitActions/RepositoryActions/RepositoryActions";

type DType = {
  getGitResourceInstallationUrl: AuthorizeResourceWithGitResult;
};

// eslint-disable-next-line
let triggerOnDone = () => {};
let triggerAuthFailed = () => {};

type Props = {
  resource: Resource;
  onDone: () => void;
};

export const CLASS_NAME = "auth-app-with-github";

function AuthResourceWithGit({ resource, onDone }: Props) {
  const { gitRepository } = resource;

  const { currentWorkspace } = useContext(AppContext);
  const gitOrganizations = currentWorkspace?.gitOrganizations;

  const [gitOrganization, setGitOrganization] =
    useState<GitOrganizationFromGitRepository | null>(null);

  useEffect(() => {
    if (gitRepository?.gitOrganization) {
      setGitOrganization(gitRepository?.gitOrganization);
    } else if (gitOrganizations?.length === 1) {
      setGitOrganization(gitOrganizations[0]);
    }
  }, [gitOrganizations, gitRepository?.gitOrganization]);

  const [selectRepoOpen, setSelectRepoOpen] = useState<boolean>(false);
  const [createNewRepoOpen, setCreateNewRepoOpen] = useState(false);
  const [popupFailed, setPopupFailed] = useState(false);
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

  const handleSelectRepoDialogOpen = useCallback(() => {
    setSelectRepoOpen(true);
  }, []);

  const handleAddProviderClick = useCallback(
    (provider: models.EnumGitProvider) => {
      trackEvent({
        eventName: AnalyticsEventNames.AddGitProviderClick,
        provider: provider,
      });
      authWithGit({
        variables: {
          gitProvider: provider,
        },
      }).catch(console.error);
    },
    []
  );

  triggerOnDone = () => {
    onDone();
  };
  triggerAuthFailed = () => {
    setPopupFailed(true);
  };
  const errorMessage = formatError(error);

  const [connectGitRepository, { error: errorUpdate }] = useMutation(
    CONNECT_GIT_REPOSITORY
  );

  const [
    createRepository,
    { loading: createRepoLoading, error: createRepoError },
  ] = useMutation(CREATE_GIT_REPOSITORY_IN_ORGANIZATION);

  const handleRepoCreated = useCallback(
    (data: CreateGitRepositoryInput) => {
      createRepository({
        variables: {
          name: data.name,
          gitOrganizationId: gitOrganization.id,
          gitProvider: EnumGitProvider.Github,
          public: data.public,
          resourceId: resource.id,
        },
        onCompleted() {
          setCreateNewRepoOpen(false);
        },
      }).catch(console.error);
      trackEvent({
        eventName: AnalyticsEventNames.GitHubRepositoryCreate,
      });
    },
    [createRepository, trackEvent, gitOrganization]
  );

  const handleRepoSelected = useCallback(
    (data: GitRepositorySelected) => {
      connectGitRepository({
        variables: {
          name: data.repositoryName,
          gitOrganizationId: data.gitOrganizationId,
          resourceId: resource.id,
        },
      }).catch(console.error);
      trackEvent({
        eventName: AnalyticsEventNames.GitHubRepositorySync,
      });
    },
    [connectGitRepository, trackEvent]
  );

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
          src={"githubPage"}
          onSelectGitRepository={(data: GitRepositorySelected) => {
            setSelectRepoOpen(false);
            handleRepoSelected(data);
          }}
          onSelectGitRepositoryDialogClose={() => {
            setSelectRepoOpen(false);
          }}
          onPopupFailedClose={() => {
            setPopupFailed(false);
          }}
          onGitCreateRepository={handleRepoCreated}
          onGitCreateRepositoryClose={() => {
            setCreateNewRepoOpen(false);
          }}
          repoCreated={{
            isRepoCreateLoading: createRepoLoading,
            RepoCreatedError: createRepoError,
          }}
        />
      )}
      <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Transparent}>
        {isEmpty(gitOrganizations) ? (
          <NewConnection
            provider={EnumGitProvider.Github}
            onSyncNewGitOrganizationClick={handleAddProviderClick}
          />
        ) : (
          <ExistingConnectionsMenu
            gitOrganizations={gitOrganizations}
            onSelectGitOrganization={(organization) => {
              setGitOrganization(organization);
            }}
            selectedGitOrganization={gitOrganization}
            onAddGitOrganization={handleAddProviderClick}
          />
        )}

        <RepositoryActions
          onCreateRepository={() => {
            setCreateNewRepoOpen(true);
          }}
          onSelectRepository={handleSelectRepoDialogOpen}
          currentResourceWithGitRepository={resource}
          selectedGitOrganization={gitOrganization}
        />

        <GitSyncNotes />
      </Panel>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
}

export default AuthResourceWithGit;

const CREATE_GIT_REPOSITORY_IN_ORGANIZATION = gql`
  mutation createGitRepository(
    $gitProvider: EnumGitProvider!
    $gitOrganizationId: String!
    $resourceId: String!
    $name: String!
    $public: Boolean!
  ) {
    createGitRepository(
      data: {
        name: $name
        public: $public
        gitOrganizationId: $gitOrganizationId
        resourceId: $resourceId
        gitProvider: $gitProvider
        gitOrganizationType: Organization
      }
    ) {
      id
      gitRepository {
        id
      }
    }
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
