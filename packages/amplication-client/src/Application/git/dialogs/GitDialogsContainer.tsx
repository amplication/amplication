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
  sourceControlService: EnumGitProvider;
  confirmRemove: boolean;
  handleConfirmRemoveAuth: any;
  handleDismissRemove: any;
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
  sourceControlService,
  confirmRemove,
  handleConfirmRemoveAuth,
  handleDismissRemove,
}: Props) {
  return (
    <div>
      <ConfirmationDialog
        isOpen={confirmRemove}
        title={`Disable Sync with ${sourceControlService}`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={`Are you sure you want to disable sync with ${sourceControlService}?`}
        onConfirm={handleConfirmRemoveAuth}
        onDismiss={handleDismissRemove}
      />
      <Dialog
        className="select-repo-dialog"
        isOpen={selectRepoOpen}
        title={`Select ${sourceControlService} repository`}
        onDismiss={handleSelectRepoDialogDismiss}
      >
        <GitRepos
          applicationId={app.id}
          gitOrganizationId={gitOrganizationId}
          onCompleted={handleSelectRepoDialogDismiss}
          sourceControlService={sourceControlService}
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
          sourceControlService={sourceControlService}
          app={app}
          gitOrganizationId={gitOrganizationId}
          onCompleted={() => {
            setGitCreateRepo(false);
          }}
        />
      </Dialog>
    </div>
  );
}
