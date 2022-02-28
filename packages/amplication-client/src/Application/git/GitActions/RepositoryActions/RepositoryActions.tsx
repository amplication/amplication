import {
  Button,
  EnumButtonStyle,
  EnumPanelStyle,
  Icon,
  Panel,
} from "@amplication/design-system";
import React from "react";
import GithubSyncDetails from "./GithubSyncDetails";
import { CLASS_NAME } from "../../AuthAppWithGit";
import "../../AuthAppWithGit.scss";
import { GitRepositoryWithGitOrganization } from "../../SyncWithGithubPage";

type Props = {
  onClickCreateRepository: () => void;
  onClickSelectRepository: () => void;
  currentConnectedGitRepository: GitRepositoryWithGitOrganization;
};
export default function RepositoryActions({
  onClickCreateRepository,
  onClickSelectRepository,
  currentConnectedGitRepository,
}: Props) {
  return (
    <div className={`${CLASS_NAME}__body`}>
      <Panel
        className={`${CLASS_NAME}__auth`}
        panelStyle={EnumPanelStyle.Bordered}
      >
        {currentConnectedGitRepository ? (
          <div>
            <GithubSyncDetails
              gitRepositoryWithOrganization={currentConnectedGitRepository}
            />
          </div>
        ) : (
          <div className={`${CLASS_NAME}__select-repo`}>
            <div className={`${CLASS_NAME}__select-repo__details`}>
              <Icon icon="info_circle" />
              No repository was selected
            </div>
            <div className={`${CLASS_NAME}__actions`}>
              <div className={`${CLASS_NAME}__action`}>
                <Button
                  buttonStyle={EnumButtonStyle.Primary}
                  onClick={onClickCreateRepository}
                  icon="plus"
                >
                  Create repository
                </Button>
              </div>
              <div className={`${CLASS_NAME}__action`}>
                <Button
                  buttonStyle={EnumButtonStyle.Primary}
                  onClick={onClickSelectRepository}
                  icon="chevron_down"
                >
                  Select repository
                </Button>
              </div>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
