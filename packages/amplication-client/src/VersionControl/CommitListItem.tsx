import React, { useContext } from "react";
import * as models from "../models";
import "./CommitListItem.scss";
import { AppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import { BuildStatusIcons } from "./BuildStatusIcons";
import CommitData from "./CommitData";

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
        <div className={`${CLASS_NAME}`}>
          <CommitData commit={commit} />
          <BuildStatusIcons build={build} showIcon={false} />
        </div>
      </InnerTabLink>
    </div>
  );
};
