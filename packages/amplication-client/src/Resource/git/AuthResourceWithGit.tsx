import {
  Dialog,
  EnumPanelStyle,
  Panel,
  Snackbar,
} from "@amplication/ui/design-system";
import { gql, useMutation } from "@apollo/client";
import { useCallback, useContext, useEffect, useState } from "react";
import * as models from "../../models";
import { AppContext } from "../../context/appContext";
import {
  AuthorizeResourceWithGitResult,
  CreateGitRepositoryInput,
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
import {
  CONNECT_GIT_REPOSITORY,
  GitRepositorySelected,
} from "./dialogs/GitRepos/GithubRepos";
import RepositoryActions from "./GitActions/RepositoryActions/RepositoryActions";
import { GitProviderConnectionList } from "./GitActions/GitProviderConnectionList";

type Props = {
  resource: Resource;
  onDone: () => void;
};

export const CLASS_NAME = "auth-app-with-git";

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
  const openSelectRepoDialog = useCallback(() => {
    setSelectRepoOpen(true);
  }, []);

  const [createNewRepoOpen, setCreateNewRepoOpen] = useState<boolean>(false);
  const openCreateNewRepo = useCallback(() => {
    setCreateNewRepoOpen(true);
  }, []);
  const closeCreateNewRepo = useCallback(() => {
    setCreateNewRepoOpen(false);
  }, []);

  const [popupFailed, setPopupFailed] = useState(false);
  const { trackEvent } = useTracking();

  const [isSelectOrganizationDialogOpen, setSelectOrganizationDialogOpen] =
    useState(false);
  const openSelectOrganizationDialog = useCallback(() => {
    setSelectOrganizationDialogOpen(true);
  }, []);
  const closeSelectOrganizationDialog = useCallback(() => {
    setSelectOrganizationDialogOpen(false);
  }, []);

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
          gitProvider: gitOrganization.provider,
          isPublic: data.isPublic,
          resourceId: resource.id,
          groupName: data.groupName,
        },
        onCompleted() {
          closeCreateNewRepo();
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
          groupName: data.groupName,
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
          gitOrganization={gitOrganization}
          isSelectRepositoryOpen={selectRepoOpen}
          isPopupFailed={popupFailed}
          gitCreateRepoOpen={createNewRepoOpen}
          gitProvider={gitOrganization.provider}
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
          onGitCreateRepositoryClose={closeCreateNewRepo}
          repoCreated={{
            isRepoCreateLoading: createRepoLoading,
            RepoCreatedError: createRepoError,
          }}
          openCreateNewRepo={openCreateNewRepo}
          setSelectRepoOpen={setSelectRepoOpen}
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
          <>
            <ExistingConnectionsMenu
              gitOrganizations={gitOrganizations}
              onSelectGitOrganization={setGitOrganization}
              selectedGitOrganization={gitOrganization}
              onAddGitOrganization={openSelectOrganizationDialog}
            />

            <RepositoryActions
              onCreateRepository={openCreateNewRepo}
              onSelectRepository={openSelectRepoDialog}
              currentResourceWithGitRepository={resource}
              selectedGitOrganization={gitOrganization}
            />
          </>
        )}
        <GitSyncNotes />
      </Panel>
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
    $isPublic: Boolean!
    $groupName: String
  ) {
    createGitRepository(
      data: {
        name: $name
        isPublic: $isPublic
        gitOrganizationId: $gitOrganizationId
        resourceId: $resourceId
        gitProvider: $gitProvider
        gitOrganizationType: Organization
        groupName: $groupName
      }
    ) {
      id
      gitRepository {
        id
        groupName
      }
    }
  }
`;
