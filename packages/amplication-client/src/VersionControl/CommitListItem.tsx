import React, { useContext } from "react";
import * as models from "../models";
import "./CommitListItem.scss";
import { AppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import { BuildStatusIcons } from "./BuildStatusIcons";
import UserBadge from "../Components/UserBadge";

type Props = {
  projectId: string;
  commit: models.Commit;
};

export const CLASS_NAME = "commit-list-item";

export const CommitListItem = ({ commit, projectId }: Props) => {
  const [build] = commit.builds;
  const { currentWorkspace } = useContext(AppContext);

  return (
    <div className={CLASS_NAME}>
      <InnerTabLink
        icon=""
        to={`/${currentWorkspace?.id}/${projectId}/commits/${commit.id}`}
      >
        <div className={`${CLASS_NAME}__data`}>
          <UserBadge />
          <div className={`${CLASS_NAME}__metadata`}>
            <span className={`${CLASS_NAME}__metadata__message`}>
              {commit.message || "no commit message"}
            </span>
            <span className={`${CLASS_NAME}__metadata__created`}>
              {new Date(commit.createdAt).toDateString()}
            </span>
          </div>
          <BuildStatusIcons build={build} showIcon={false} />
        </div>
      </InnerTabLink>
    </div>
  );
};
