import { Dialog } from "@amplication/design-system";
import React from "react";
import { EnumGitProvider } from "../../../models";
import { AppWithGitRepository } from "../SyncWithGithubPage";
import GitCreateRepo from "./GitCreateRepo/GitCreateRepo";
import GitRepos from "./GitRepos/GithubRepos";

type Props = {
  app: AppWithGitRepository;
  gitOrganizationId: string;
  selectRepoOpen: boolean;
  onSelectGitRepositoryDialogClose: () => void;
  popupFailed: boolean;
  handlePopupFailedClose: any;
  gitCreateRepoOpen: boolean;
  setGitCreateRepo: any;
  gitProvider: EnumGitProvider;
  gitOrganizationName: string;
};

export default function GitDialogsContainer({
  app,
  gitOrganizationId,
  selectRepoOpen,
  onSelectGitRepositoryDialogClose,
  popupFailed,
  handlePopupFailedClose,
  gitCreateRepoOpen,
  setGitCreateRepo,
  gitProvider,
  gitOrganizationName,
}: Props) {
  return (
    <div>
      <Dialog
        className="select-repo-dialog"
        isOpen={selectRepoOpen}
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
        isOpen={popupFailed}
        title="Popup failed to load"
        onDismiss={handlePopupFailedClose}
      >
        Please make sure that you allow popup windows in the browser
      </Dialog>
      <Dialog
        className="git-create-dialog"
        isOpen={gitCreateRepoOpen}
        title="Create new repository"
        onDismiss={() => {
          setGitCreateRepo(false);
        }}
      >
        <GitCreateRepo
          gitProvider={gitProvider}
          app={app}
          gitOrganizationId={gitOrganizationId}
          onCompleted={() => {
            setGitCreateRepo(false);
          }}
          gitOrganizationName={gitOrganizationName}
        />
      </Dialog>
    </div>
  );
}
