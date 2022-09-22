import React, { useContext } from "react";
import * as models from "../models";
import "./CommitListItem.scss";
import { AppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import CommitData from "./CommitData";
import CommitBuildsStatus from "./CommitBuildsStatus";

type Props = {
  projectId: string;
  commit: models.Commit;
};

export const CLASS_NAME = "commit-list-item";

export const CommitListItem = ({ commit, projectId }: Props) => {
  const builds = commit.builds;
  const { currentWorkspace } = useContext(AppContext);

  return (
    <div className={CLASS_NAME}>
      <InnerTabLink
        icon=""
        to={`/${currentWorkspace?.id}/${projectId}/commits/${commit.id}`}
      >
        <div className={`${CLASS_NAME}`}>
          <CommitData commit={commit} />
          <CommitBuildsStatus builds={builds} />
        </div>
      </InnerTabLink>
    </div>
  );
};
