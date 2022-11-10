import {
  Button,
  EnumButtonStyle,
  EnumPanelStyle,
  Icon,
  Panel,
} from "@amplication/design-system";
import React from "react";
import { EnumGitOrganizationType, Resource } from "../../../../models";
import "../../AuthResourceWithGit.scss";
import {
  GitOrganizationFromGitRepository,
} from "../../SyncWithGithubPage";
import GithubSyncDetails from "./GithubSyncDetails";
import "./RepositoryActions.scss";
type Props = {
  onCreateRepository: () => void;
  onSelectRepository: () => void;
  currentResourceWithGitRepository: Resource;
  selectedGitOrganization: GitOrganizationFromGitRepository | null;
};

const CLASS_NAME = "repository-actions";
export default function RepositoryActions({
  onCreateRepository,
  onSelectRepository,
  currentResourceWithGitRepository,
  selectedGitOrganization,
}: Props) {
  const { gitRepository } = currentResourceWithGitRepository;

  return (
    <div className={`${CLASS_NAME}`}>
      <Panel
        className={`${CLASS_NAME}__auth`}
        panelStyle={EnumPanelStyle.Bordered}
      >
        {gitRepository ? (
          <GithubSyncDetails
            resourceWithRepository={currentResourceWithGitRepository}
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
                      buttonStyle={EnumButtonStyle.Primary}
                      onClick={onSelectRepository}
                    >
                      Select repository
                    </Button>
                  </div>
                  {selectedGitOrganization.type ===
                    EnumGitOrganizationType.Organization && (
                    <div className={`${CLASS_NAME}__action`}>
                      <Button
                        buttonStyle={EnumButtonStyle.Primary}
                        onClick={onCreateRepository}
                        icon="plus"
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
