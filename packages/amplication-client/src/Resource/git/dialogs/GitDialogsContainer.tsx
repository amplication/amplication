import { Dialog } from "@amplication/design-system";
import { ApolloError } from "@apollo/client";
import { EnumGitProvider } from "../../../models";
import GitCreateRepo from "./GitCreateRepo/GitCreateRepo";
import WizardGitCreateRepo from "./GitCreateRepo/WizardGitCreateRepo";
import GitRepos, {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "./GitRepos/GithubRepos";

type Props = {
  gitOrganizationId: string;
  isSelectRepositoryOpen: boolean;
  isPopupFailed: boolean;
  gitCreateRepoOpen: boolean;
  gitProvider: EnumGitProvider;
  gitOrganizationName: string;
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
};

export default function GitDialogsContainer({
  gitOrganizationId,
  isSelectRepositoryOpen,
  isPopupFailed,
  gitCreateRepoOpen,
  gitProvider,
  gitOrganizationName,
  repoCreated,
  src,
  onGitCreateRepository,
  onPopupFailedClose,
  onSelectGitRepositoryDialogClose,
  onSelectGitRepository,
  onGitCreateRepositoryClose,
}: Props) {
  return (
    <div>
      <Dialog
        className="select-repo-dialog"
        isOpen={isSelectRepositoryOpen}
        title={`Select ${gitProvider} repository`}
        onDismiss={onSelectGitRepositoryDialogClose}
      >
        <GitRepos
          gitOrganizationId={gitOrganizationId}
          onGitRepositoryConnected={onSelectGitRepository}
          gitProvider={gitProvider}
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
            gitProvider={gitProvider}
            repoCreated={repoCreated}
            gitOrganizationName={gitOrganizationName}
            onCreateGitRepository={onGitCreateRepository}
            gitOrganizationId={gitOrganizationId}
          ></WizardGitCreateRepo>
        ) : (
          <GitCreateRepo
            gitProvider={gitProvider}
            repoCreated={repoCreated}
            gitOrganizationName={gitOrganizationName}
            onCreateGitRepository={onGitCreateRepository}
          />
        )}
      </Dialog>
    </div>
  );
}
