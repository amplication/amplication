import React, { useCallback } from "react";
import * as models from "../models";
import { useHistory } from "react-router-dom";

import { UserAndTime, Panel, EnumPanelStyle } from "@amplication/design-system";

import { ClickableId } from "../Components/ClickableId";

import "./CommitListItem.scss";
import { BuildStatusIcons } from "./BuildStatusIcons";

type Props = {
  applicationId: string;
  commit: models.Commit;
};

export const CLASS_NAME = "commit-list-item";

export const CommitListItem = ({ commit, applicationId }: Props) => {
  const [build] = commit.builds;
  const history = useHistory();

  const handleBuildLinkClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const handleRowClick = useCallback(() => {
    history.push(`/${applicationId}/commits/${commit.id}`);
  }, [history, applicationId, commit]);

  const account = commit.user?.account;

  return (
    <Panel
      className={CLASS_NAME}
      clickable
      onClick={handleRowClick}
      panelStyle={EnumPanelStyle.Bordered}
    >
      <div className={`${CLASS_NAME}__row`}>
        <ClickableId
          className={`${CLASS_NAME}__title`}
          id={commit.id}
          label=""
          to={`/${applicationId}/commit/${commit.id}`}
          eventData={{
            eventName: "commitListCommitIdClick",
          }}
        />
        <span className="spacer" />
        {build && (
          <ClickableId
            className={`${CLASS_NAME}__build`}
            label="Build ID"
            to={`/${applicationId}/builds/${build.id}`}
            id={build.id}
            onClick={handleBuildLinkClick}
            eventData={{
              eventName: "commitListBuildIdClick",
            }}
          />
        )}
        <UserAndTime account={account} time={commit.createdAt} />
      </div>
      <div className={`${CLASS_NAME}__row`}>
        <span className={`${CLASS_NAME}__description`}>{commit.message}</span>
        <span className="spacer" />
        <BuildStatusIcons build={build} />
      </div>
    </Panel>
  );
};
