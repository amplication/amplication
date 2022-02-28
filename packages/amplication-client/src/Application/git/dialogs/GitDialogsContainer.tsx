import { ConfirmationDialog, Dialog } from "@amplication/design-system";
import React from "react";
import { App, EnumGitProvider } from "../../../models";
import GitCreateRepo from "./GitCreateRepo/GitCreateRepo";
import GitRepos from "./GitRepos/GithubRepos";

type Props = {
  app: App;
  gitOrganizationId: string;
  selectRepoOpen: boolean;
  handleSelectRepoDialogDismiss: any;
  popupFailed: boolean;
  handlePopupFailedClose: any;
  gitCreateRepoOpen: boolean;
  setGitCreateRepo: any;
  gitProvider: EnumGitProvider;
  confirmRemove: boolean;
  handleConfirmRemoveAuth: any;
  handleDismissRemove: any;
  gitOrganizationName: string;
};
const CONFIRM_BUTTON = { label: "Disable Sync" };
const DISMISS_BUTTON = { label: "Dismiss" };

export default function GitDialogsContainer({
  app,
  gitOrganizationId,
  selectRepoOpen,
  handleSelectRepoDialogDismiss,
  popupFailed,
  handlePopupFailedClose,
  gitCreateRepoOpen,
  setGitCreateRepo,
  gitProvider,
  confirmRemove,
  handleConfirmRemoveAuth,
  handleDismissRemove,
  gitOrganizationName,
}: Props) {
  return (
    <div>
      <ConfirmationDialog
        isOpen={confirmRemove}
        title={`Disable Sync with ${gitProvider}`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={`Are you sure you want to disable sync with ${gitProvider}?`}
        onConfirm={handleConfirmRemoveAuth}
        onDismiss={handleDismissRemove}
      />
      <Dialog
        className="select-repo-dialog"
        isOpen={selectRepoOpen}
        title={`Select ${gitProvider} repository`}
        onDismiss={handleSelectRepoDialogDismiss}
      >
        <GitRepos
          applicationId={app.id}
          gitOrganizationId={gitOrganizationId}
          onCompleted={handleSelectRepoDialogDismiss}
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
