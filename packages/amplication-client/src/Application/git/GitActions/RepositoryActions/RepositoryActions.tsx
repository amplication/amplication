import {
  Button,
  EnumButtonStyle,
  EnumPanelStyle,
  Icon,
  Panel,
} from "@amplication/design-system";
import React from "react";
import { CLASS_NAME } from "../../AuthAppWithGithub";
import "../../AuthAppWithGithub.scss";

type Props = {
  onClickCreateRepository: () => void;
  onClickSelectRepository: () => void;
};
export default function RepositoryActions({
  onClickCreateRepository,
  onClickSelectRepository,
}: Props) {
  return (
    <div className={`${CLASS_NAME}__body`}>
      <Panel
        className={`${CLASS_NAME}__auth`}
        panelStyle={EnumPanelStyle.Bordered}
      >
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
              >
                Create repository
              </Button>
            </div>
            <div className={`${CLASS_NAME}__action`}>
              <Button
                buttonStyle={EnumButtonStyle.Primary}
                onClick={onClickSelectRepository}
              >
                Select repository
              </Button>
            </div>
          </div>
        </div>
        {/* {!app.githubSyncEnabled ? (
          <div>dfsa</div>
          ) : (
              <GithubSyncDetails app={app} />
            )} */}
      </Panel>
    </div>
  );
}
