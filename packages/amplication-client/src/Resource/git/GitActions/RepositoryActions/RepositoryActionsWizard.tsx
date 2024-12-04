import {
  Button,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  FlexItem,
  Icon,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import { EnumGitOrganizationType } from "../../../../models";
import { GitRepositorySelected } from "../../dialogs/GitRepos/GithubRepos";
import { GitOrganizationFromGitRepository } from "../../ResourceGitSettingsPage";
import "./RepositoryActions.scss";
import ResourceGitSyncDetailsWizard from "./ResourceGitSyncDetailsWizard";
import { EnumGitProvider } from "@amplication/code-gen-types";
type Props = {
  onCreateRepository: () => void;
  onSelectRepository: () => void;
  onDisconnectGitRepository: () => void;
  selectedGitOrganization: GitOrganizationFromGitRepository | null;
  selectedGitRepository: GitRepositorySelected;
};

export default function RepositoryActionsWizard({
  onCreateRepository,
  onSelectRepository,
  selectedGitOrganization,
  selectedGitRepository,
  onDisconnectGitRepository,
}: Props) {
  return (
    <Panel panelStyle={EnumPanelStyle.Bold}>
      {selectedGitRepository?.gitOrganizationId ? (
        <ResourceGitSyncDetailsWizard
          repositorySelected={selectedGitRepository}
          onDisconnectGitRepository={onDisconnectGitRepository}
        />
      ) : (
        <>
          <FlexItem
            itemsAlign={EnumItemsAlign.Center}
            start={
              <Text textColor={EnumTextColor.ThemeRed}>
                <FlexItem
                  itemsAlign={EnumItemsAlign.Center}
                  direction={EnumFlexDirection.Row}
                  gap={EnumGapSize.Small}
                >
                  <Icon icon="info_circle" />
                  No repository was selected
                </FlexItem>
              </Text>
            }
            end={
              selectedGitOrganization && (
                <FlexItem>
                  <Button
                    type="button"
                    buttonStyle={EnumButtonStyle.Outline}
                    onClick={onSelectRepository}
                  >
                    Select repository
                  </Button>
                  {selectedGitOrganization.type ===
                    EnumGitOrganizationType.Organization && (
                    <Button
                      type="button"
                      buttonStyle={EnumButtonStyle.Primary}
                      onClick={onCreateRepository}
                    >
                      Create repository
                    </Button>
                  )}
                  {selectedGitOrganization.type ===
                    EnumGitOrganizationType.User &&
                    selectedGitOrganization.provider ===
                      EnumGitProvider.Github && (
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
                    )}
                </FlexItem>
              )
            }
          ></FlexItem>
        </>
      )}
    </Panel>
  );
}
