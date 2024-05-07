import { Dialog } from "@amplication/ui/design-system";
import { ApolloError } from "@apollo/client";
import { EnumGitProvider } from "../../../models";
import GitCreateRepo from "./GitCreateRepo/GitCreateRepo";
import WizardGitCreateRepo from "./GitCreateRepo/WizardGitCreateRepo";
import GitRepos, {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "./GitRepos/GithubRepos";
import { GitOrganizationFromGitRepository } from "../SyncWithGithubPage";
import "./GitDialogsContainer.scss";
import { useCallback } from "react";
import { PROVIDERS_DISPLAY_NAME } from "../../constants";

type Props = {
  gitOrganization: GitOrganizationFromGitRepository;
  isSelectRepositoryOpen: boolean;
  isPopupFailed: boolean;
  gitCreateRepoOpen: boolean;
  gitProvider: EnumGitProvider;
  src: string;
  repoCreated?: {
    isRepoCreateLoading: boolean;
    RepoCreatedError: ApolloError;
  };
  onGitCreateRepository: (data: GitRepositoryCreatedData) => void;
  onPopupFailedClose: () => void;
  onGitCreateRepositoryClose: () => void;
  onSelectGitRepositoryDialogClose: () => void;
  onSelectGitRepository: (data: GitRepositorySelected) => void;
  openCreateNewRepo?: () => void;
  closeSelectRepoDialog?: () => void;
};

export default function GitDialogsContainer({
  gitOrganization,
  isSelectRepositoryOpen,
  isPopupFailed,
  gitCreateRepoOpen,
  gitProvider,
  repoCreated,
  src,
  onGitCreateRepository,
  onPopupFailedClose,
  onSelectGitRepositoryDialogClose,
  onSelectGitRepository,
  onGitCreateRepositoryClose,
  openCreateNewRepo,
  closeSelectRepoDialog,
}: Props) {
  const handleCreateNewRepoClick = useCallback(() => {
    closeSelectRepoDialog();
    openCreateNewRepo();
  }, [closeSelectRepoDialog, openCreateNewRepo]);

  const providerDisplayName = PROVIDERS_DISPLAY_NAME[gitProvider];

  return (
    <div>
      <Dialog
        className="select-repo-dialog"
        isOpen={isSelectRepositoryOpen}
        title={`Select ${providerDisplayName} repository`}
        onDismiss={onSelectGitRepositoryDialogClose}
      >
        <GitRepos
          gitOrganization={gitOrganization}
          onGitRepositoryConnected={onSelectGitRepository}
          gitProvider={gitProvider}
          openCreateNewRepo={handleCreateNewRepoClick}
        />
      </Dialog>
      <Dialog
        className="popup-failed-dialog"
        isOpen={isPopupFailed}
        title="Popup failed to load"
        onDismiss={onPopupFailedClose}
      >
        Please make sure that you allow popup windows in the browser
      </Dialog>
      <Dialog
        className="git-create-dialog"
        isOpen={gitCreateRepoOpen}
        title="Create new repository"
        onDismiss={onGitCreateRepositoryClose}
      >
        {src === "serviceWizard" ? (
          <WizardGitCreateRepo
            repoCreated={repoCreated}
            onCreateGitRepository={onGitCreateRepository}
            gitOrganization={gitOrganization}
          ></WizardGitCreateRepo>
        ) : (
          <GitCreateRepo
            gitOrganization={gitOrganization}
            repoCreated={repoCreated}
            onCreateGitRepository={onGitCreateRepository}
          />
        )}
      </Dialog>
    </div>
  );
}
