import React from "react";
import { EnumGitProvider, Resource } from "../../models";
import { Dialog, EnumPanelStyle, Panel } from "@amplication/ui/design-system";
import GitDialogsContainer from "./dialogs/GitDialogsContainer";
import ExistingConnectionsMenu from "./GitActions/ExistingConnectionsMenu";
import {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "./dialogs/GitRepos/GithubRepos";
import useGitHook from "./useAuthWithGit";
import { GitProviderConnectionList } from "./GitActions/GitProviderConnectionList";
import { isEmpty } from "lodash";
import WizardRepositoryActions from "./GitActions/RepositoryActions/WizardRepositoryActions";
import RepositoryActions from "./GitActions/RepositoryActions/RepositoryActions";
import "./AuthWithGit.scss";

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
  } = useGitHook({
    resource,
    gitRepositorySelected,
    gitRepositoryDisconnectedCb,
    gitRepositoryCreatedCb,
    gitRepositorySelectedCb,
  });

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
              <RepositoryActions
                onCreateRepository={openCreateNewRepo}
                onSelectRepository={openSelectRepoDialog}
                currentResourceWithGitRepository={resource}
                selectedGitOrganization={gitOrganization}
              />
            )}
          </>
        )}
      </Panel>
    </>
  );
};

export default AuthWithGitProvider;
