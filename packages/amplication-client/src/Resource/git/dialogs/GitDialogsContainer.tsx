import { Resource } from "@amplication/code-gen-types/dist/models";
import { Dialog } from "@amplication/design-system";
import React from "react";
import { EnumGitProvider } from "../../../models";
import GitCreateRepo from "./GitCreateRepo/GitCreateRepo";
import GitRepos from "./GitRepos/GithubRepos";

type Props = {
  resource: Resource;
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
  resource,
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
          resourceId={resource.id}
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
          resource={resource}
          gitOrganizationId={gitOrganizationId}
          onCompleted={onGitCreateRepository}
          gitOrganizationName={gitOrganizationName}
        />
      </Dialog>
    </div>
  );
}
