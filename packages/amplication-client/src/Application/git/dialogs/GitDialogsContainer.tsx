import { Dialog } from "@amplication/design-system";
import React from "react";
import { EnumGitProvider } from "../../../models";
import { AppWithGitRepository } from "../SyncWithGithubPage";
import GitCreateRepo from "./GitCreateRepo/GitCreateRepo";
import GitRepos from "./GitRepos/GithubRepos";

type Props = {
  app: AppWithGitRepository;
  gitOrganizationId: string;
  isSelectRepositoryOpen: boolean;
  isPopupFailed: boolean;
  gitCreateRepoOpen: boolean;
  gitProvider: EnumGitProvider;
  gitOrganizationName: string;
  onGitCreateRepository: () => void;
  onPopupFailedClose: () => void;
  onSelectGitRepositoryDialogClose: () => void;
};

export default function GitDialogsContainer({
  app,
  gitOrganizationId,
  isSelectRepositoryOpen,
  isPopupFailed,
  gitCreateRepoOpen,
  gitProvider,
  gitOrganizationName,
  onGitCreateRepository,
  onPopupFailedClose,
  onSelectGitRepositoryDialogClose,
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
          applicationId={app.id}
          gitOrganizationId={gitOrganizationId}
          onGitRepositoryConnected={onSelectGitRepositoryDialogClose}
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
        onDismiss={onGitCreateRepository}
      >
        <GitCreateRepo
          gitProvider={gitProvider}
          app={app}
          gitOrganizationId={gitOrganizationId}
          onCompleted={onGitCreateRepository}
          gitOrganizationName={gitOrganizationName}
        />
      </Dialog>
    </div>
  );
}
