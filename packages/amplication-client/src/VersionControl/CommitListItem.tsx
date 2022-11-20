import React, { useContext } from "react";
import * as models from "../models";
import "./CommitListItem.scss";
import { AppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import CommitData from "./CommitData";
import { useCommitStatus } from "./hooks/useCommitStatus";
import { CommitBuildsStatusIcon } from "./CommitBuildsStatusIcon";

type Props = {
  projectId: string;
  commit: models.Commit;
};

export const CLASS_NAME = "commit-list-item";

export const CommitListItem = ({ commit, projectId }: Props) => {
  const { currentWorkspace } = useContext(AppContext);
  const { commitStatus } = useCommitStatus(commit);
  return (
    <div className={`${CLASS_NAME}__row`}>
      <InnerTabLink
        icon=""
        to={`/${currentWorkspace?.id}/${projectId}/commits/${commit.id}`}
      >
        <div className={CLASS_NAME}>
          <CommitData commit={commit} />
          <CommitBuildsStatusIcon commitBuildStatus={commitStatus} />
        </div>
      </InnerTabLink>
    </div>
  );
};
