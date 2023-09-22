import { Dialog, EnumPanelStyle, Panel } from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import React, { useCallback } from "react";
import { EnumGitProvider, Resource } from "../../models";
import "./AuthWithGit.scss";
import ExistingConnectionsMenu from "./GitActions/ExistingConnectionsMenu";
import { GitProviderConnectionList } from "./GitActions/GitProviderConnectionList";
import RepositoryActions from "./GitActions/RepositoryActions/RepositoryActions";
import RepositoryForm from "./GitActions/RepositoryActions/RepositoryForm";
import WizardRepositoryActions from "./GitActions/RepositoryActions/WizardRepositoryActions";
import GitDialogsContainer from "./dialogs/GitDialogsContainer";
import {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "./dialogs/GitRepos/GithubRepos";
import useGitHook from "./useAuthWithGit";
import * as models from "../../models";

interface AuthWithGitProviderProps {
  type: "wizard" | "resource";
  gitProvider?: EnumGitProvider;
  onDone: () => void;
  resource?: Resource;
  gitRepositoryDisconnectedCb?: () => void;
  gitRepositoryCreatedCb?: (data: GitRepositoryCreatedData) => void;
  gitRepositorySelectedCb: (data: GitRepositorySelected) => void;
  gitRepositorySelected?: GitRepositorySelected;
}

const AuthWithGitProvider: React.FC<AuthWithGitProviderProps> = ({
  type,
  gitProvider,
  onDone,
  resource,
  gitRepositoryDisconnectedCb,
  gitRepositoryCreatedCb,
  gitRepositorySelectedCb,
  gitRepositorySelected,
}) => {
  const CLASS_NAME = type === "wizard" ? "auth-with-git" : "auth-app-with-git";

  const {
    gitOrganizations,
    gitOrganization,
    gitRepositorySelectedData,
    isSelectOrganizationDialogOpen,
    createNewRepoOpen,
    selectRepoOpen,
    popupFailed,
    setPopupFailed,
    connectGitRepoLoading,
    connectGitRepoError,
    handleRepoSelected,
    handleRepoCreated,
    handleOrganizationChange,
    handleRepoDisconnected,
    openSelectOrganizationDialog,
    closeSelectOrganizationDialog,
    openSelectRepoDialog,
    closeSelectRepoDialog,
    openCreateNewRepo,
    closeCreateNewRepo,
    updateGitRepository,
  } = useGitHook({
    resource,
    gitRepositorySelected,
    gitRepositoryDisconnectedCb,
    gitRepositoryCreatedCb,
    gitRepositorySelectedCb,
  });

  const handleUpdateGitRepositorySubmit = useCallback(
    (data: models.GitRepositoryUpdateInput) => {
      updateGitRepository(resource?.gitRepository.id, data);
    },
    [updateGitRepository]
  );

  return (
    <>
      {gitOrganization && (
        <GitDialogsContainer
          gitOrganization={gitOrganization}
          isSelectRepositoryOpen={selectRepoOpen}
          isPopupFailed={popupFailed}
          gitCreateRepoOpen={createNewRepoOpen}
          gitProvider={gitProvider || gitOrganization.provider}
          src={type === "wizard" ? "serviceWizard" : "githubPage"}
          onSelectGitRepository={(data: GitRepositorySelected) => {
            closeSelectRepoDialog();
            handleRepoSelected(data);
          }}
          onSelectGitRepositoryDialogClose={() => {
            closeSelectRepoDialog();
          }}
          onPopupFailedClose={() => {
            setPopupFailed(false);
          }}
          onGitCreateRepository={handleRepoCreated}
          onGitCreateRepositoryClose={closeCreateNewRepo}
          repoCreated={{
            isRepoCreateLoading: connectGitRepoLoading,
            RepoCreatedError: connectGitRepoError,
          }}
          openCreateNewRepo={openCreateNewRepo}
          closeSelectRepoDialog={closeSelectRepoDialog}
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
              onSelectGitOrganization={handleOrganizationChange}
              selectedGitOrganization={gitOrganization}
              onAddGitOrganization={openSelectOrganizationDialog}
            />
            {type === "wizard" ? (
              <WizardRepositoryActions
                onCreateRepository={openCreateNewRepo}
                onSelectRepository={openSelectRepoDialog}
                onDisconnectGitRepository={handleRepoDisconnected}
                selectedGitOrganization={gitOrganization}
                selectedGitRepository={gitRepositorySelectedData}
              />
            ) : (
              <>
                <RepositoryActions
                  onCreateRepository={openCreateNewRepo}
                  onSelectRepository={openSelectRepoDialog}
                  currentResourceWithGitRepository={resource}
                  selectedGitOrganization={gitOrganization}
                />
                {resource?.gitRepository && (
                  <>
                    <RepositoryForm
                      defaultValues={resource?.gitRepository}
                      onSubmit={handleUpdateGitRepositorySubmit}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </Panel>
    </>
  );
};

export default AuthWithGitProvider;
