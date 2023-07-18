import {
  Button,
  EnumButtonStyle,
  EnumPanelStyle,
  Icon,
  Panel,
} from "@amplication/ui/design-system";
import React from "react";
import { EnumGitOrganizationType } from "../../../../models";
import "../../AuthResourceWithGit.scss";
import { GitRepositorySelected } from "../../dialogs/GitRepos/GithubRepos";
import { GitOrganizationFromGitRepository } from "../../SyncWithGithubPage";
import "./RepositoryActions.scss";
import WizardGithubSyncDetails from "./WizardGithubSyncDetails";
import { EnumGitProvider } from "@amplication/code-gen-types/models";
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
                      >
                        Create repository
                      </Button>
                    </div>
                  )}
                  {selectedGitOrganization.type ===
                    EnumGitOrganizationType.User &&
                    selectedGitOrganization.provider ===
                      EnumGitProvider.Github && (
                      <div className={`${CLASS_NAME}__action`}>
                        <a
                          href={`https://github.com/new?&owner=${selectedGitOrganization.name}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            type="button"
                            buttonStyle={EnumButtonStyle.Primary}
                          >
                            Create repository
                          </Button>
                        </a>
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
