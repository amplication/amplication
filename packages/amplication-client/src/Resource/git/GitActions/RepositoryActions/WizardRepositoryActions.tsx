import {
  Button,
  EnumButtonStyle,
  EnumPanelStyle,
  Icon,
  Panel,
} from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import { EnumGitOrganizationType } from "../../../../models";
import "../../AuthResourceWithGit.scss";
import { GitRepositorySelected } from "../../dialogs/GitRepos/GithubRepos";
import { GitOrganizationFromGitRepository } from "../../SyncWithGithubPage";
import "./RepositoryActions.scss";
import WizardGithubSyncDetails from "./WizardGithubSyncDetails";
import { ENTER } from "../../../../util/hotkeys";
type Props = {
  onCreateRepository: () => void;
  onSelectRepository: () => void;
  onDisconnectGitRepository: () => void;
  selectedGitOrganization: GitOrganizationFromGitRepository | null;
  selectedGitRepository: GitRepositorySelected;
};

const CLASS_NAME = "repository-actions";
export default function WizardRepositoryActions({
  onCreateRepository,
  onSelectRepository,
  selectedGitOrganization,
  selectedGitRepository,
  onDisconnectGitRepository,
}: Props) {
  const handleKeyDownOnSelectRepository = useCallback(
    (keyEvent: React.KeyboardEvent<HTMLButtonElement>) => {
      if (keyEvent.key === ENTER) {
        onSelectRepository && onSelectRepository();
      }
    },
    [onSelectRepository]
  );

  const handleKeyDownOnCreateRepository = useCallback(
    (keyEvent: React.KeyboardEvent<HTMLButtonElement>) => {
      if (keyEvent.key === ENTER) {
        onCreateRepository && onCreateRepository();
      }
    },
    [onCreateRepository]
  );

  return (
    <div className={`${CLASS_NAME}`}>
      <Panel
        className={`${CLASS_NAME}__wizard_auth`}
        panelStyle={EnumPanelStyle.Bordered}
      >
        {selectedGitRepository?.gitOrganizationId ? (
          <WizardGithubSyncDetails
            repositorySelected={selectedGitRepository}
            onDisconnectGitRepository={onDisconnectGitRepository}
          />
        ) : (
          <div className={`${CLASS_NAME}__select-repo`}>
            <div className={`${CLASS_NAME}__select-repo__details`}>
              <Icon icon="info_circle" />
              No repository was selected
            </div>
            <div className={`${CLASS_NAME}__actions`}>
              {selectedGitOrganization && (
                <>
                  <div className={`${CLASS_NAME}__action`}>
                    <Button
                      type="button"
                      buttonStyle={EnumButtonStyle.Outline}
                      onClick={onSelectRepository}
                      onKeyDown={handleKeyDownOnSelectRepository}
                    >
                      Select repository
                    </Button>
                  </div>
                  {selectedGitOrganization.type ===
                    EnumGitOrganizationType.Organization && (
                    <div className={`${CLASS_NAME}__action`}>
                      <Button
                        type="button"
                        buttonStyle={EnumButtonStyle.Primary}
                        onClick={onCreateRepository}
                        onKeyDown={handleKeyDownOnCreateRepository}
                      >
                        Create repository
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
